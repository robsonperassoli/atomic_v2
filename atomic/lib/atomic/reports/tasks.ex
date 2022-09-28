defmodule Atomic.Reports.Tasks do
  @moduledoc false
  @behaviour Atomic.Reports.Report

  alias Atomic.ProjectManagement.Task
  alias Atomic.Repo
  alias Atomic.Reports.Templates

  @impl true
  def prepare_data(%{user: user, period: :week}) do
    now = Timex.now()

    start_of_week = Timex.beginning_of_week(now)
    end_of_week = Timex.end_of_week(now)

    {:ok, fetch_period(user.id, start_of_week, end_of_week)}
  end

  def prepare_data(%{user: user, period: :month}) do
    now = Timex.now()

    start_of_month = Timex.beginning_of_month(now)
    end_of_month = Timex.end_of_month(now)

    {:ok, fetch_period(user.id, start_of_month, end_of_month)}
  end

  def prepare_data(%{user: user, period: :custom, start_time: start_time, end_time: end_time}) do
    {:ok, fetch_period(user.id, start_time, end_time)}
  end

  @impl true
  def generate(%{params: _params, data: _data} = report) do
    report
    |> Templates.Tasks.to_html_string()
    |> PdfGenerator.generate_binary(page_size: "A4")
  end

  defp fetch_period(user_id, start_time, end_time) do
    Task.by_user_at_period(user_id, start_time, end_time)
    |> Repo.all()
  end
end
