import { CloudUpload, Plus } from "lucide-react";
import Modal from "./Modal";
import UploadFile from "./Upload";

function Header({
  handleUploaded,
  searchQuery,
  setSearchQuery,
  handleSubmit,
}: {
  handleUploaded: () => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <nav className="p-5 flex items-center justify-between bg-white">
      <form
        onSubmit={handleSubmit}
        className="gap-3 flex items-center justify-center w-full"
        action=""
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Course code, Title or Subject"
          className="border w-[60%] px-3 py-2 rounded-full outline-none"
          type="text"
        />
        {/* <button className="bg-primary px-3 py-2 rounded-lg text-white">
          Search
        </button> */}
      </form>
      {/* <button>Upload</button> */}
      <Modal>
        <Modal.ModalOpener opensModalName="uploadModal">
          <span
            className={
              "flex items-center px-2 py-2 text-sm font-medium rounded-md group text-gray-400 bg-gray-800 cursor-pointer"
            }
          >
            <span className="text-gray-500 mr-3">
              <CloudUpload color="white" size={20} />
            </span>
            <span className="inline">Upload</span>
          </span>
        </Modal.ModalOpener>
        <Modal.ModalWindow name="uploadModal">
          <UploadFile onUploadSuccess={handleUploaded} />
        </Modal.ModalWindow>
      </Modal>
    </nav>
  );
}

export default Header;
