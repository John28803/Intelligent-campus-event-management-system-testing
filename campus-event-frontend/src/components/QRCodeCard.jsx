import { QRCodeCanvas } from "qrcode.react";

function QRCodeCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-fit">

      <h2 className="text-2xl font-bold mb-4">
        Event QR Code
      </h2>

      <QRCodeCanvas
        value="student-event-attendance-12345"
        size={220}
      />

    </div>
  );
}

export default QRCodeCard;