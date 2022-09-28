defmodule Atomic.ProjectManagement.Project do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Atomic.Accounts.User
  alias Atomic.ProjectManagement.Project
  alias Atomic.ProjectManagement.Task

  schema "projects" do
    field :abbreviation, :string
    field :name, :string
    belongs_to :created_by_user, User
    has_many :tasks, Task

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:name, :abbreviation, :created_by_user_id])
    |> validate_required([:name, :abbreviation, :created_by_user_id])
    |> validate_length(:abbreviation, is: 7)
  end

  def get_user_project_query(user_id, project_id) do
    from p in get_user_projects_query(user_id),
      where: p.id == ^project_id
  end

  def get_user_projects_query(user_id) do
    from p in Project,
      where: p.created_by_user_id == ^user_id
  end
end
