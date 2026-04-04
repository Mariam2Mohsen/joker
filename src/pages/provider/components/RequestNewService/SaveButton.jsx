import Button from '../../components/Button'; // تأكد من المسار الصحيح

export const SaveButton = ({ loading }) => (
  <div className="flex justify-end mt-6">
    <Button
      type="submit"
      variant="primary"
      disabled={loading}
      className="w-full sm:w-auto px-6 sm:px-10 py-2.5 text-sm font-bold"
    >
      {loading ? "Saving..." : "Save"}
    </Button>
  </div>
);