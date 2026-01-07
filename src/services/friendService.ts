import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
   arrayUnion
} from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

// Tạo yêu cầu kết bạn
export async function sendFriendRequest(
  fromUserName: string,
  toUserName: string
): Promise<void> {
  await addDoc(collection(db, "friend_requests"), {
    from: fromUserName,
    to: toUserName,
    timestamp: Date.now(),
  });
}

// Lấy danh sách yêu cầu kết bạn gửi đến user
export async function getFriendRequests(UserName: string) {
  const q = query(
    collection(db, "friend_requests"),
    where("to", "==", UserName)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Hủy/từ chối yêu cầu kết bạn (chỉ xóa request)
export async function cancelFriendRequest(requestId: string): Promise<void> {
  await deleteDoc(doc(db, "friend_requests", requestId));
}

// Chấp nhận yêu cầu kết bạn: thêm bạn bè 2 chiều, xóa request
export async function acceptFriendRequest(
  requestId: string,
  fromUserName: string,
  toUserName: string
) {
  const userRef1 = doc(db, "users", fromUserName);
  const userRef2 = doc(db, "users", toUserName);
  await updateDoc(userRef1, { friends: arrayUnion({ name: toUserName }) });
  await updateDoc(userRef2, { friends: arrayUnion({ name: fromUserName }) });
  await deleteDoc(doc(db, "friend_requests", requestId));
}

// Lấy danh sách bạn bè của user
export async function getFriends(UserName: string) {
  const userRef = doc(db, "users", UserName);
  const snapshot = await getDoc(userRef);
  const data = snapshot.data();
  if (data && Array.isArray(data.friends)) {
    return data.friends;
  }
  return [];
}

// Tạo user mới
export async function createUser(userName: string) {
  const userRef = doc(db, "users", userName);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return;
  }
  await setDoc(doc(db, "users", userName), {
    name: userName,
    friends: [],
  });
}
