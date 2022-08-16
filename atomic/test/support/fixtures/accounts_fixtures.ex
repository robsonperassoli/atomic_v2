defmodule Atomic.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Atomic.Accounts` context.
  """

  @doc """
  Generate a unique user email.
  """
  def unique_user_email, do: "some email#{System.unique_integer([:positive])}"

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: unique_user_email(),
        name: "some name"
      })
      |> Atomic.Accounts.create_user()

    user
  end
end
