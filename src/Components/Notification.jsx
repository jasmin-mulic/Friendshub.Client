import noProfilePic from "../assets/noProfilePic.jpg";
import { CheckCircle } from "lucide-react";
import { dateToText } from "../Helpers";

const Notification = ({ notification }) => {

console.log(notification)

    return (
        <div className="group flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition">

            <img
                className="w-10 h-10 rounded-full object-cover"
                src={notification.senderProfileImageUrl ?? noProfilePic}
                alt=""
            />

            <p className="text-sm text-gray-200 flex-1 leading-snug">
                {notification.message}<br>
                </br>
                            <small>{dateToText(notification.createdAt)}</small>

            </p>
            <button
                className="ml-auto p-2 rounded-full hover:scale-110 transition-transform"
                title="Mark as read"
            >
                <CheckCircle title="Mark as read" className="w-5 h-5 text-blue-400 hover:text-green-400" />
            </button>
        </div>
    );
};
export default Notification;
