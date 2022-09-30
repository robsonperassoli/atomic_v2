defmodule Atomic.ReportsTest do
  @moduledoc false

  use Atomic.DataCase

  alias Atomic.Reports

  describe "build/2" do
    test "works" do
      assert {:ok, pdf_file} = Reports.build(:test, %{p1: 1, p2: 2})
      assert File.exists?(pdf_file)
    end
  end
end
