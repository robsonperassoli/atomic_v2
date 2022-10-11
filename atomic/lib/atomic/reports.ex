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

  def upload(local_pdf_path), do: upload(local_pdf_path, report_id())

  def upload(local_pdf_path, report_id) do
    storage_path = "#{report_id}.pdf"

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
    report
    |> build(params)
    |> case do
      {:ok, local_pdf_file} ->
        upload(local_pdf_file, params[:report_id])

      e ->
        e
    end
  end

  def spawn_builder_task(report, params) do
    report_id = report_id()

    Task.Supervisor.start_child(Atomic.Reports.Supervisor, fn ->
      report
      |> Atomic.Reports.build_and_upload(Map.put(params, :report_id, report_id))
      |> case do
        {:ok, report_url} ->
          Absinthe.Subscription.publish(AtomicWeb.Endpoint, report_url, report_ready: report_id)

        e ->
          Logger.error(
            "[Atomic.Reports.Worker] #{report} report failed with params: #{inspect(params)}. Error details: #{inspect(e)}"
          )
      end
    end)
    |> case do
      {:ok, _pid} -> {:ok, report_id}
      e -> e
    end
  end

  defp find_report_spec(:tasks, _params), do: Atomic.Reports.Tasks
  defp find_report_spec(:test, _params), do: Atomic.Reports.Test
  defp find_report_spec(report, _params), do: raise("Unknown report type #{report}")

  defp to_pdf({:ok, html_content}), do: PdfGenerator.generate(html_content, page_size: "A4")
  defp to_pdf(e), do: e

  defp report_id(), do: Ecto.UUID.generate()
end
