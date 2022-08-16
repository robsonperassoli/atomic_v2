defmodule Atomic.ProjectManagement.Permission do
  use Ecto.Schema
  import Ecto.Changeset

  schema "project_permissions" do
    field :type, Ecto.Enum, values: [:regular, :admin]
    field :project_id, :id
    field :user_id, :id
    field :team_id, :id

    timestamps()
  end

  @doc false
  def changeset(permission, attrs) do
    permission
    |> cast(attrs, [:type])
    |> validate_required([:type])
  end
end
