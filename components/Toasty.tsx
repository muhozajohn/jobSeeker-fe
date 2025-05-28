import { Bounce, toast } from "react-toastify";

export default async function Toast({
	message,
	type,
	title,
}: {
	message: string;
	title?: string;
	type: "info" | "success" | "warning" | "error";
}) {
	return toast(
		<div>
			{title && (
				<div
					className={`font-semibold ${
						type === "error"
							? "text-red-500"
							: type === "success"
							? "text-green-500"
							: type === "warning"
							? "text-orange-500"
							: type === "info"
							? "text-blue-500"
							: ""
					}`}
				>
					{title}
				</div>
			)}
			<div>{message}</div>
		</div>,
		{
			type: type,
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
		}
	);
}
