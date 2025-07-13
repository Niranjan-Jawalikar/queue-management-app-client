import "./Modal.scss";

export const Modal = ({
  newName,
  setNewName,
  setShowModal,
  handleAddToken,
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add New Token</h3>
        <input
          type="text"
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleAddToken}>Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
