defmodule Atomic.Reports.TasksTest do
  @moduledoc false
  use Atomic.DataCase
  import Atomic.Factory
  alias Atomic.Reports.Tasks

  describe "prepare_data/1" do
    setup do
      user = insert(:user)
      [user: user]
    end

    test "returns the correct tasks for the weekly period", %{user: user} do
      beginning_of_this_week =
        Timex.now()
        |> Timex.beginning_of_week()

      beginning_of_past_week =
        beginning_of_this_week
        |> Timex.shift(weeks: -1)

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: beginning_of_this_week
      })

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: beginning_of_past_week
      })

      assert {:ok, data} = Tasks.prepare_data(%{period: :week, user_id: user.id})
      assert length(data) == 3
    end

    test "returns the correct tasks for the monthly period", %{user: user} do
      beginning_of_this_month =
        Timex.now()
        |> Timex.beginning_of_month()

      beginning_of_past_month =
        beginning_of_this_month
        |> Timex.shift(months: -1)

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: beginning_of_this_month
      })

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: beginning_of_past_month
      })

      assert {:ok, data} = Tasks.prepare_data(%{period: :month, user_id: user.id})
      assert length(data) == 3
    end

    test "returns the correct tasks for a custom period", %{user: user} do
      outside_period =
        Timex.now()
        |> Timex.beginning_of_month()

      beginning_of_period =
        outside_period
        |> Timex.shift(days: 4)

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: outside_period
      })

      insert_list(3, :task, %{
        created_by_user: user,
        inserted_at: beginning_of_period
      })

      assert {:ok, data} =
               Tasks.prepare_data(%{
                 period: :custom,
                 user_id: user.id,
                 start_time: beginning_of_period,
                 end_time: Timex.shift(beginning_of_period, days: 4)
               })

      assert length(data) == 3
    end
  end

  describe "generate/1" do
    test "generates the html to be converted" do
      [t1, t2, t3] = tasks = insert_list(3, :task)

      assert {:ok, html} = Tasks.generate(%{params: %{}, data: tasks})
      assert is_binary(html)
      assert html =~ t1.content
      assert html =~ t2.content
      assert html =~ t3.content
    end
  end
end
