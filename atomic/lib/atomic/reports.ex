defmodule Atomic.Reports do
  @moduledoc false

  def build(report, params) do
    report_impl = find_report_spec(report, params)

    case report_impl.prepare_data(params) do
      {:ok, data} ->
        report_impl.generate(%{params: params, data: data})

      {:error, value} ->
        {:error, "#{report_impl}: Report generation failed with #{value}"}
    end
  end

  defp find_report_spec(:tasks, _params), do: Atomic.Reports.Tasks
  defp find_report_spec(:test, _params), do: Atomic.Reports.Test
  defp find_report_spec(report, _params), do: raise("Unknown report type #{report}")
end
