defmodule Atomic.Reports.Test do
  @moduledoc false
  @behaviour Atomic.Reports.Report

  @impl true
  def prepare_data(_params) do
    {:ok, [1, 2, 3]}
  end

  @impl true
  def generate(%{params: _params, data: _data}) do
    {:ok, "1,2,3"}
  end
end
