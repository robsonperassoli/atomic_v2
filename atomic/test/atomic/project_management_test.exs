defmodule Atomic.ProjectManagementTest do
  use Atomic.DataCase
  import Atomic.Factory
  import Atomic.TestHelpers

  alias Atomic.ProjectManagement
  alias Atomic.ProjectManagement.Project

  describe "projects" do
    setup do
      user = insert(:user)

      %{user: user}
    end

    test "create project works when params are valid", %{user: user} do
      name = Faker.App.name()
      abbreviation = "PRJ0001"

      assert {:ok, project} =
               user
               |> ProjectManagement.create_project(%{name: name, abbreviation: abbreviation})

      assert project.name == name
      assert project.abbreviation == abbreviation
      assert project.created_by_user_id == user.id
    end

    test "create project validates abbreviation length", %{user: user} do
      name = Faker.App.name()
      abbreviation = "PRJ10"

      assert {:error, changeset} =
               ProjectManagement.create_project(user, %{name: name, abbreviation: abbreviation})

      assert %{abbreviation: ["should be 7 character(s)"]} = changeset_errors(changeset)
    end

    test "update project works", %{user: user} do
      project =
        insert(:project, name: "Initial Name", abbreviation: "ABR1234", created_by_user: user)

      new_name = Faker.App.name()
      new_abbreviation = "UPT1234"

      assert {:ok, project} =
               ProjectManagement.update_project(user, project.id, %{
                 name: new_name,
                 abbreviation: new_abbreviation
               })

      assert project.name == new_name
      assert project.abbreviation == new_abbreviation
    end

    test "update project ensures ownership", %{user: user} do
      malicious_user = insert(:user)

      project =
        insert(:project, name: "Initial Name", abbreviation: "ABR1234", created_by_user: user)

      new_name = Faker.App.name()
      new_abbreviation = "UPT1234"

      assert {:error, :not_found} =
               ProjectManagement.update_project(malicious_user, project.id, %{
                 name: new_name,
                 abbreviation: new_abbreviation
               })
    end

    test "delete project works", %{user: user} do
      project = insert(:project, created_by_user: user)

      assert {:ok, _project} = ProjectManagement.delete_project(user, project.id)

      assert is_nil(Atomic.Repo.get(Project, project.id))
    end

    test "delete project ensures ownership", %{user: user} do
      malicious_user = insert(:user)

      project = insert(:project, created_by_user: user)

      assert {:error, :not_found} = ProjectManagement.delete_project(malicious_user, project.id)
    end
  end

  describe "tasks" do
  end
end
