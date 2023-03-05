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

    test "get project works", %{user: user} do
      project = insert(:project, created_by_user: user)

      assert {:ok, found_project} = ProjectManagement.get_project(user, project.id)
      assert project.id == found_project.id
    end

    test "get project respects ownership", %{user: user} do
      malicious_user = insert(:user)

      project = insert(:project, created_by_user: user)

      assert {:error, :not_found} = ProjectManagement.get_project(malicious_user, project.id)
    end

    test "list user projects works", %{user: user} do
      other_user = insert(:user)
      insert_list(5, :project, created_by_user: user)
      insert_list(5, :project, created_by_user: other_user)

      assert projects = ProjectManagement.list_projects(user)
      assert Enum.count(projects) == 5
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

      task = insert(:task, content: "content", time_sec: 11_111, created_by_user: user)

      assert {:error, :task_not_found} =
               ProjectManagement.update_task(malicious_user, task.id, %{
                 content: "malicious update",
                 time_sec: 0
               })
    end

    test "update task fails when timer running and time is changed", %{user: user} do
      task =
        insert(:running_task, content: "Initial Content", time_sec: 120, created_by_user: user)

      new_content = Faker.Lorem.sentence(6)
      new_time = 124

      assert {:error, changeset} =
               ProjectManagement.update_task(user, task.id, %{
                 content: new_content,
                 time_sec: new_time
               })

      assert %{time_sec: ["cannot update time on a running task timer"]} =
               changeset_errors(changeset)
    end

    test "start task timer works", %{user: user} do
      task = insert(:task, created_by_user: user, status: :stopped)

      assert {:ok, task} = ProjectManagement.start_task_timer(user, task.id)
      assert task.status == :running
      refute is_nil(task.last_started_at)
      assert is_nil(task.last_stopped_at)
    end

    test "cannot start a started task", %{user: user} do
      task = insert(:running_task, created_by_user: user)

      assert {:error, _cs} = ProjectManagement.start_task_timer(user, task.id)
    end

    test "stop task timer works", %{user: user} do
      task = insert(:running_task, created_by_user: user)

      assert {:ok, task} = ProjectManagement.stop_task_timer(user, task.id)
      assert task.time_sec > 0
      assert task.status == :stopped
      refute is_nil(task.last_stopped_at)
    end

    test "cannot stop a stopped task", %{user: user} do
      task = insert(:stopped_task, created_by_user: user)

      assert {:error, _cs} = ProjectManagement.stop_task_timer(user, task.id)
    end
  end

  describe "search" do
    setup do
      %{user: insert(:user)}
    end

    test "returns expected results when searching for description", %{user: user} do
      insert_list(5, :task, created_by_user: user)
      insert(:task, created_by_user: user, content: "build api")

      assert [task] = ProjectManagement.search_tasks(user, "build api")
      assert task.content == "build api"
    end
  end
end
