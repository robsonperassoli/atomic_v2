defmodule Atomic.Factory do
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
end
