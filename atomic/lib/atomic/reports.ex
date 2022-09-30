defmodule Atomic.Reports do
  @moduledoc false

  alias Atomic.Storage
  require Logger

  @upload_bucket "reports"

  def build(report, params) do
    report_impl = find_report_spec(report, params)

    case report_impl.prepare_data(params) do
      {:ok, data} ->
        %{params: params, data: data}
        |> report_impl.generate()
        |> to_pdf()

      {:error, value} ->
        {:error, "#{report_impl}: Report generation failed with #{value}"}
    end
  end

  def upload(local_pdf_path) do
    storage_path = "#{Ecto.UUID.generate()}.pdf"

    Storage.upload(@upload_bucket, local_pdf_path, storage_path)
    |> case do
      {:ok, _} ->
        @upload_bucket
        |> Storage.sign_url(storage_path)
        |> then(&{:ok, &1})

      e ->
        e
    end
  end

  def build_and_upload(report, params) do
    with {:ok, local_pdf_file} <- build(report, params),
         {:ok, report_url} <- upload(local_pdf_file) do
      {:ok, report_url}
    end
  end

  def spawn_builder_task(report, params) do
    Task.Supervisor.start_child(Atomic.Reports.Supervisor, fn ->
      report
      |> Atomic.Reports.build_and_upload(params)
      |> case do
        {:ok, report_url} ->
          report_url

        e ->
          Logger.error(
            "[Atomic.Reports.Worker] #{report} report failed with params: #{inspect(params)}. Error details: #{inspect(e)}"
          )

          e
      end
    end)
  end

  defp find_report_spec(:tasks, _params), do: Atomic.Reports.Tasks
  defp find_report_spec(:test, _params), do: Atomic.Reports.Test
  defp find_report_spec(report, _params), do: raise("Unknown report type #{report}")

  defp to_pdf({:ok, html_content}), do: PdfGenerator.generate(html_content, page_size: "A4")
  defp to_pdf(e), do: e
end
