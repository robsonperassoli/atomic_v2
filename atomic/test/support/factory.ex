defmodule Atomic.Factory do
  @moduledoc false
  use ExMachina.Ecto, repo: Atomic.Repo

  def user_factory() do
    %Atomic.Accounts.User{
      name: Faker.Person.name(),
      email: Faker.Internet.email()
    }
  end

  def project_factory() do
    %Atomic.ProjectManagement.Project{
      name: Faker.App.name(),
      abbreviation: sequence(:abbreviation, &String.pad_leading("#{&1}", 7)),
      created_by_user: build(:user)
    }
  end

  def task_factory() do
    %Atomic.ProjectManagement.Task{
      content: Faker.Lorem.sentence(),
      time_sec: 0,
      created_by_user: build(:user),
      project: build(:project)
    }
  end

  def running_task_factory do
    struct!(
      task_factory(),
      %{
        last_started_at:
          Timex.now()
          |> Timex.shift(hours: -1),
        status: :running
      }
    )
  end

  def stopped_task_factory do
    struct!(
      task_factory(),
      %{
        last_started_at:
          Timex.now()
          |> Timex.shift(hours: -1),
        last_stopped_at: Timex.now(),
        status: :stopped
      }
    )
  end
end
