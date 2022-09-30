defmodule Atomic.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Atomic.Repo

  alias Atomic.Accounts.{User, Session}

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Gets a single user.

  Returns {:error, :not_found} if the User does not exist.

  ## Examples

      iex> get_user(123)
      {:ok, %User{}}

      iex> get_user(456)
      {:error, :not_found}

  """
  def get_user(id) do
    User
    |> Repo.get(id)
    |> case do
      nil -> {:error, :not_found}
      user -> {:ok, user}
    end
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def sign_in_with_provider(%Ueberauth.Auth{provider: :github, info: info} = auth) do
    email = info.email

    get_user_by_provider(:github, email)
    |> case do
      nil ->
        User.github_registration_changeset(auth)
        |> Repo.insert()

      user ->
        {:ok, user}
    end
  end

  def get_user_by_provider(provider, email) do
    from(u in User,
      join: i in assoc(u, :identities),
      where: i.provider == ^to_string(provider) and i.provider_email == ^email
    )
    |> Repo.one()
  end

  def create_session(%User{id: user_id}) do
    rand_size = 32
    token = :crypto.strong_rand_bytes(rand_size)

    %Session{}
    |> Session.changeset(%{token: token, user_id: user_id})
    |> Repo.insert()
  end

  def get_user_by_session_token(token) do
    Session.verify_token_query(token)
    |> Repo.one()
  end
end
