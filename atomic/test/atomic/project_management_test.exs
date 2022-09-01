defmodule Atomic.ProjectManagementTest do
  use Atomic.DataCase
  import Atomic.Factory
  import Atomic.TestHelpers

  alias Atomic.ProjectManagement
  alias Atomic.ProjectManagement.{Project, Task}

  setup do
    user = insert(:user)

    %{user: user}
  end

  describe "projects" do
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
    setup %{user: user} do
      project = insert(:project, created_by_user: user)

      %{project: project}
    end

    test "create task suceeds with valid input", %{user: user, project: project} do
      content = "migrate atomic"

      assert {:ok, task} =
               ProjectManagement.create_task(user, project.id, %{
                 content: content,
                 time_sec: 0
               })

      assert task.content == content
      assert task.time_sec == 0
      assert task.project_id == project.id
      assert task.created_by_user_id == user.id
    end

    test "create task respects projects permissions", %{user: _user, project: project} do
      malicious_user = insert(:user)

      content = "migrate atomic"

      assert {:error, :not_found} =
               ProjectManagement.create_task(malicious_user, project.id, %{
                 content: content,
                 time_sec: 0
               })
    end

    test "delete task works", %{user: user, project: _project} do
      task = insert(:task, created_by_user: user)

      assert {:ok, task} = ProjectManagement.delete_task(user, task.id)

      assert is_nil(Atomic.Repo.get(Task, task.id))
    end

    test "delete task fails when user is not the owner", %{user: user} do
      task = insert(:task, created_by_user: user)
      malicious_user = insert(:user)

      assert {:error, :task_not_found} = ProjectManagement.delete_task(malicious_user, task.id)
    end

    test "update task works", %{user: user} do
      task = insert(:task, content: "Initial Content", time_sec: 0, created_by_user: user)

      new_content = Faker.Lorem.sentence(6)
      new_time = 120

      assert {:ok, task} =
               ProjectManagement.update_task(user, task.id, %{
                 content: new_content,
                 time_sec: new_time
               })

      assert task.content == new_content
      assert task.time_sec == new_time
    end

    test "update task respects ownership", %{user: user} do
      malicious_user = insert(:user)

      task = insert(:task, content: "content", time_sec: 11111, created_by_user: user)

      assert {:error, :task_not_found} =
               ProjectManagement.update_task(malicious_user, task.id, %{
                 content: "malicious update",
                 time_sec: 0
               })
    end
  end
end
