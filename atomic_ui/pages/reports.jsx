import { gql, useMutation, useSubscription } from '@apollo/client'
import { useFormik } from 'formik'
import { useState } from 'react'
import useModal from '../hooks/use_modal'
import Button from '../components/button'
import Layout from '../components/layout'
import DownloadReportModal from '../components/pages/reports/download_report_modal'
import PeriodDropdown from '../components/pages/reports/period_dropdown'

const DOWNLOAD_REPORT = 'DOWNLOAD_REPORT'

const TASKS_REPORT_MUTATION = gql`
  mutation CreateTasksReport(
    $period: TasksReportPeriod!
    $startTime: DateTime
    $endTime: DateTime
  ) {
    reportId: createTasksReport(
      period: $period
      startTime: $startTime
      endTime: $endTime
    )
  }
`

const REPORT_READY_SUBSCRIPTION = gql`
  subscription ReportReadySubscription($reportId: String!) {
    reportUrl: reportReady(reportId: $reportId)
  }
`

const ReportsPage = () => {
  const [reportId, setReportId] = useState(null)

  const modal = useModal()
  const [createReportMutation] = useMutation(TASKS_REPORT_MUTATION)

  useSubscription(REPORT_READY_SUBSCRIPTION, {
    variables: { reportId },
    skip: !reportId,
    onSubscriptionData: ({ subscriptionData }) => {
      setReportId(null)

      modal.open(DOWNLOAD_REPORT, {
        reportUrl: subscriptionData?.data?.reportUrl,
      })
    },
  })

  const createReport = async ({ period }) => {
    const { data } = await createReportMutation({
      variables: { period },
    })

    setReportId(data.reportId)
  }

  const form = useFormik({
    onSubmit: createReport,
    initialValues: {
      period: 'WEEK',
      startTime: null,
      endTime: null,
    },
  })

  return (
    <>
      <form
        onSubmit={form.handleSubmit}
        className="max-w-2xl mx-auto mt-6 border rounded-xl p-4 bg-white"
      >
        <h2 className="font-bold tracking-wide text-2xl text-gray-800 pb-2">
          Task Reports
        </h2>
        <p className="text-slate-600 font-medium leading-5">
          Select a time window to generate a pdf report with all tasks created
          within that period.
        </p>

        <div className="max-w-sm mt-4">
          <PeriodDropdown
            value={form.values.period}
            onChange={(period) => form.setFieldValue('period', period)}
          />
        </div>

        {reportId ? (
          <button disabled className="text-slate-700 py-2 mt-6">
            <i className="fas fa-gear animate-spin text-purple-600 mr-2 font-medium" />
            We are working on your report...
          </button>
        ) : (
          <Button type="submit" className="mt-6">
            Create Report
          </Button>
        )}
      </form>

      <DownloadReportModal
        isOpen={modal.isOpen(DOWNLOAD_REPORT)}
        onClose={modal.close}
        reportUrl={modal.props?.reportUrl}
      />
    </>
  )
}

ReportsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ReportsPage
