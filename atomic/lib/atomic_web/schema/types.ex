defmodule AtomicWeb.Schema.Types do
  @moduledoc """
  Type definitions for the GraphQL api
  """
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
    field :status, :task_timer_status

    field :last_started_at, :datetime
    field :last_stopped_at, :datetime
  end

  enum :task_timer_status do
    value :running
    value :stopped
  end

  object :user do
    field :id, :id
    field :name, :string
    field :email, :string
  end
end
