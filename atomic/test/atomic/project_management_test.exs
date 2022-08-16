defmodule Atomic.ProjectManagementTest do
  use Atomic.DataCase

  alias Atomic.ProjectManagement

  describe "projects" do
    alias Atomic.ProjectManagement.Project

    import Atomic.ProjectManagementFixtures

    @invalid_attrs %{abbreviation: nil, name: nil}

    test "list_projects/0 returns all projects" do
      project = project_fixture()
      assert ProjectManagement.list_projects() == [project]
    end

    test "get_project!/1 returns the project with given id" do
      project = project_fixture()
      assert ProjectManagement.get_project!(project.id) == project
    end

    test "create_project/1 with valid data creates a project" do
      valid_attrs = %{abbreviation: "some abbreviation", name: "some name"}

      assert {:ok, %Project{} = project} = ProjectManagement.create_project(valid_attrs)
      assert project.abbreviation == "some abbreviation"
      assert project.name == "some name"
    end

    test "create_project/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = ProjectManagement.create_project(@invalid_attrs)
    end

    test "update_project/2 with valid data updates the project" do
      project = project_fixture()
      update_attrs = %{abbreviation: "some updated abbreviation", name: "some updated name"}

      assert {:ok, %Project{} = project} = ProjectManagement.update_project(project, update_attrs)
      assert project.abbreviation == "some updated abbreviation"
      assert project.name == "some updated name"
    end

    test "update_project/2 with invalid data returns error changeset" do
      project = project_fixture()
      assert {:error, %Ecto.Changeset{}} = ProjectManagement.update_project(project, @invalid_attrs)
      assert project == ProjectManagement.get_project!(project.id)
    end

    test "delete_project/1 deletes the project" do
      project = project_fixture()
      assert {:ok, %Project{}} = ProjectManagement.delete_project(project)
      assert_raise Ecto.NoResultsError, fn -> ProjectManagement.get_project!(project.id) end
    end

    test "change_project/1 returns a project changeset" do
      project = project_fixture()
      assert %Ecto.Changeset{} = ProjectManagement.change_project(project)
    end
  end
end
