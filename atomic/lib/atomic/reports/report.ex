defmodule Atomic.Reports.Report do
  @moduledoc """
  This module defines the behaviour for the reports
  """

  @type prepare_params() :: map()
  @type prepare_response() :: {:ok, any()} | {:error, any()}

  @type generate_params() :: %{data: any(), params: map()}
  @type generate_response() :: {:ok, binary()} | {:error, any()}

  @doc """
   Fetches data to use later in the report generation
  """
  @callback prepare_data(prepare_params()) :: prepare_response()

  @doc """
   Builds the report content into the pdf process
  """
  @callback generate(generate_params()) :: generate_response()
end
