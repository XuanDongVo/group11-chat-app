import "../../styles/Offcanvas.css";
import type { OffcanvasProps } from "../../types/FriendInvites";

function Offcanvas({ open, onClose, children, title }: OffcanvasProps) {
    return (
        <div
            className={`offcanvas-backdrop${open ? " show" : ""}`}
            onClick={onClose}
        >
            <div
                className={`offcanvas-panel${open ? " show" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="offcanvas-header">
                    <span className="offcanvas-title">{title}</span>
                    <button className="offcanvas-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="offcanvas-body">{children}</div>
            </div>
        </div>
    );
}

export default Offcanvas;
