defmodule Atomic.ProjectManagementFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Atomic.ProjectManagement` context.
  """

  @doc """
  Generate a project.
  """
  def project_fixture(attrs \\ %{}) do
    {:ok, project} =
      attrs
      |> Enum.into(%{
        abbreviation: "some abbreviation",
        name: "some name"
      })
      |> Atomic.ProjectManagement.create_project()

    project
  end
end
