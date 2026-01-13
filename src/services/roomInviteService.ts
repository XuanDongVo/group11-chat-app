import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  arrayUnion,
  getDocs,
  type DocumentReference,
} from "firebase/firestore";
import app from "./firebase";
import { getFriends } from "./friendService";

const db = getFirestore(app);

export type RoomInvite = {
  id: string;
  roomId: string;
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
  acceptedAt?: number;
  rejectedAt?: number;
};

export type RoomDoc = {
  id: string; // firestore doc id 
  roomId: string; // room name (vd NLU_FE_GROUP11)
  members: string[];
  createdAt?: number;
};

async function getRoomRefByRoomId(roomId: string): Promise<DocumentReference> {
  // 1) try direct docId == roomId
  const directRef = doc(db, "rooms", roomId);
  const directSnap = await getDoc(directRef);
  if (directSnap.exists()) return directRef;

  // 2) query by field roomId
  const q = query(collection(db, "rooms"), where("roomId", "==", roomId));
  const qs = await getDocs(q);
  if (!qs.empty) return qs.docs[0].ref;

  // 3) create new doc with random id
  const newRef = await addDoc(collection(db, "rooms"), {
    roomId,
    members: [],
    createdAt: Date.now(),
  });
  return newRef;
}

export async function ensureRoom(roomId: string) {
  const ref = await getRoomRefByRoomId(roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { roomId, members: [], createdAt: Date.now() });
  }
  return ref;
}

export async function getRoomMembers(roomId: string): Promise<string[]> {
  const ref = await getRoomRefByRoomId(roomId);
  const snap = await getDoc(ref);
  const data = snap.data();
  return Array.isArray(data?.members) ? data.members : [];
}

export async function listInvitableFriends(params: {
  currentUser: string;
  roomId: string;
}) {
  const [friends, members] = await Promise.all([
    getFriends(params.currentUser),
    getRoomMembers(params.roomId),
  ]);

  const friendNames = (friends || [])
    .map((f: any) => f?.name)
    .filter(Boolean)
    .filter((name: string) => name !== params.currentUser);

  // bỏ qua những người đã có trong room
  return friendNames.filter((name: string) => !members.includes(name));
}

export async function sendRoomInvite(params: {
  roomId: string;
  from: string;
  to: string;
}) {
  await ensureRoom(params.roomId);
  await addDoc(collection(db, "room_invites"), {
    roomId: params.roomId,
    from: params.from,
    to: params.to,
    status: "pending",
    createdAt: Date.now(),
  });
}

export function listenPendingRoomInvites(
  toUser: string,
  cb: (invites: RoomInvite[]) => void
) {
  const q = query(
    collection(db, "room_invites"),
    where("to", "==", toUser),
    where("status", "==", "pending")
  );

  return onSnapshot(q, (snap) => {
    const invites = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as RoomInvite[];
    cb(invites);
  });
}

export async function acceptRoomInvite(params: {
  inviteId: string;
  roomId: string; // room name: NLU_FE_GROUP11
  username: string;
}) {
  // mark accepted
  await updateDoc(doc(db, "room_invites", params.inviteId), {
    status: "accepted",
    acceptedAt: Date.now(),
  });

  // add member to room (update đúng document rooms/* theo field roomId)
  const roomRef = await getRoomRefByRoomId(params.roomId);
  await updateDoc(roomRef, {
    members: arrayUnion(params.username),
  });
}

export async function rejectRoomInvite(inviteId: string) {
  await updateDoc(doc(db, "room_invites", inviteId), {
    status: "rejected",
    rejectedAt: Date.now(),
  });
}

/**
 * Lấy danh sách rooms user đang là member -> Sidebar tab "Nhóm" sẽ auto update
 */
export function listenRoomsOfUser(
  username: string,
  cb: (rooms: RoomDoc[]) => void
) {
  const q = query(
    collection(db, "rooms"),
    where("members", "array-contains", username)
  );

  return onSnapshot(q, (snap) => {
    const rooms = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        roomId: data.roomId ?? d.id,
        members: Array.isArray(data.members) ? data.members : [],
        createdAt: data.createdAt,
      } as RoomDoc;
    });
    cb(rooms);
  });
}

// thêm thành viên vào room (dùng khi tạo room mới thì tự thêm mình vào)
export async function addMemberToRoom(roomId: string, username: string) {
  const roomRef = await getRoomRefByRoomId(roomId);
  await updateDoc(roomRef, {
    members: arrayUnion(username),
  });
}

