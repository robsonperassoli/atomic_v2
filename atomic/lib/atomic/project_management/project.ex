defmodule Atomic.ProjectManagement.Project do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Atomic.Accounts.User
  alias Atomic.ProjectManagement.Project

  schema "projects" do
    field :abbreviation, :string
    field :name, :string
    belongs_to :created_by_user, User

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
    from p in Project,
      where: p.id == ^project_id and p.created_by_user_id == ^user_id
  end
end
