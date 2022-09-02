const CreateTaskButton = () => {
  return (
    <button
      type="button"
      className="appearance-none focus:outline-none border border-violet-300 text-slate-800 font-medium rounded-xl px-4 py-2 flex items-center bg-white shadow-shiny-button tracking-wide"
    >
      <i className="fas fa-plus text-violet-600 text-xl mr-4" /> Create task
    </button>
  )
}

export default CreateTaskButton
