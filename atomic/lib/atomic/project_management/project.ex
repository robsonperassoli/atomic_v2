defmodule Atomic.ProjectManagement.Project do
  use Ecto.Schema
  import Ecto.Changeset

  schema "projects" do
    field :abbreviation, :string
    field :name, :string
    field :created_by_user_id, :id

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:name, :abbreviation])
    |> validate_required([:name, :abbreviation])
  end
end
