defmodule Atomic.Reports.Templates.Tasks do
  @moduledoc """
    Renders a task report in html format
  """

  def to_html_string(%{params: params, data: tasks}) do
    """
    <html>
      <head>
        <style>
          * {font-family: helvetica, arial, sans-serif;}
        </style>
      </head>
      <body>
        #{header(params)}
        #{task_list(tasks)}
      </body>
    </html>
    """
  end

  defp header(_params) do
    """
    <h1>Tasks Report</h1>
    """
  end

  defp task_list(tasks) do
    """
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="text-align: right; background-color: #b9babb; padding: 10px 5px">#</th>
        <th style="text-align: left; background-color: #b9babb;">Content</th>
        <th style="text-align: right; background-color: #b9babb; padding: 10px 5px">Duration</th>
      </tr>
      #{task_rows(tasks, "")}
    </table>
    """
  end

  defp task_rows([], html), do: html

  defp task_rows([task | remaining], html) do
    time =
      (task.time_sec || 0)
      |> Timex.Duration.from_seconds()
      |> Timex.format_duration(:humanized)

    task_html = """
    <tr>
      <td style="text-align: right; border-bottom: 1px solid #ccc; padding: 10px 5px;">#{task.id}</td>
      <td style="border-bottom: 1px solid #ccc;">#{task.content}</td>
      <td style="text-align: right; border-bottom: 1px solid #ccc; padding: 10px 5px">
        #{if task.status === :running, do: "(running)"}
        #{time}
      </td>
    </tr>
    """

    task_rows(remaining, "#{html}#{task_html}")
  end
end
