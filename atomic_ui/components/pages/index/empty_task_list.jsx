const EmptyTaskList = () => {
  return (
    <div className="min-h-[20rem] flex flex-col items-center justify-center gap-y-3">
      <i className="far fa-clock text-6xl text-zinc-200" />
      <p className="font-semibold text-slate-500 text-lg text-center px-4">
        Looks like your task list is empty for this date.
      </p>
    </div>
  )
}

export default EmptyTaskList
