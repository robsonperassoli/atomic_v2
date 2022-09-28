defmodule Atomic.Teams.TeamMember do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset

  schema "team_members" do
    field :membership_type, Ecto.Enum, values: [:regular, :admin]
    field :user_id, :id
    field :team_id, :id

    timestamps()
  end

  @doc false
  def changeset(team_member, attrs) do
    team_member
    |> cast(attrs, [:membership_type])
    |> validate_required([:membership_type])
  end
end
