import Avatar from "./components/Avatar";

function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin p-10">
        <Avatar seed="PAPAFAM Support Agent" />
      </div>
    </div>
  );
}
export default Loading;
