import Modal from '../../modal'

const DownloadReportModal = ({ isOpen, onClose, reportUrl }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-sm text-center p-6"
    >
      <span className="inline-flex w-16 h-16 items-center justify-center text-4xl border border-purple-600 rounded-full">
        <i className="fas fa-check text-purple-600" />
      </span>

      <p className="text-gray-600 font-medium mt-3">
        You report is ready! Click the link below to download.
      </p>
      <a
        href={reportUrl}
        target="_blank"
        onClick={onClose}
        rel="noreferrer"
        className="inline-block bg-purple-600 text-white rounded-lg py-2 px-4 font-medium text-lg tracking-wide mt-4"
      >
        <i className="fas fa-print" /> Download
      </a>
    </Modal>
  )
}

export default DownloadReportModal
