defmodule Atomic.ReportsTest do
  @moduledoc false

  use Atomic.DataCase

  alias Atomic.Reports

  describe "build/2" do
    test "works" do
      {:ok, "1,2,3"} = Reports.build(:test, %{p1: 1, p2: 2})
    end
  end
end
