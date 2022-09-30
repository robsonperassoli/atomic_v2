defmodule Atomic.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      Atomic.Repo,
      AtomicWeb.Telemetry,
      {Phoenix.PubSub, name: Atomic.PubSub},
      AtomicWeb.Endpoint,
      {Task.Supervisor, name: Atomic.Reports.Supervisor, max_children: 20}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Atomic.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    AtomicWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
