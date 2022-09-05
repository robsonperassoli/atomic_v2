defmodule AtomicWeb.Schema.Types do
  use Absinthe.Schema.Notation
  import Absinthe.Resolution.Helpers, only: [dataloader: 1]
  alias Atomic.ProjectManagement

  object :project do
    field :id, :id
    field :name, :string
    field :abbreviation, :string

    field :tasks, list_of(:task) do
      arg :start_time, non_null(:datetime)
      arg :end_time, non_null(:datetime)

      resolve dataloader(ProjectManagement)
    end
  end

  object :task do
    field :id, :id
    field :content, :string
    field :time_sec, :integer
  end
end
