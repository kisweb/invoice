import { Invoice, Totals } from "@/type";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { ArrowDownFromLine, SatelliteDish } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

interface FacturePDFProps {
  invoice: Invoice;
  totals: Totals;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("fr-FR", options);
}

const InvoicePDF: React.FC<FacturePDFProps> = ({ invoice, totals }) => {
  const factureRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = factureRef.current;
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "A4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297) //pdfWidth, pdfHeight);
        pdf.save(`facture-${invoice.id}-${invoice.name}.pdf`);

        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
      }
    }
  };

  return (
    <div className="mt-4 block md:block">
      <div className="border-base-300 border-2 border-dashed rounded-xl p-2">
        <button
          onClick={handleDownloadPdf}
          className="btn btn-sm btn-accent mb4"
        >
          Facture PDF
          <ArrowDownFromLine className="w-4" />
        </button>
        <div className="p-8" ref={factureRef}>
          <div className="flex justify-between items-center text-sm">
            <div className="flex flex-col border-1 rounded-xl p-1">
              <div className="flex items-center rounded-xl">
                <Image
                  src="/taureau1.png"
                  width={64}
                  height={64}
                  alt="Logo Kis@rrw3b"
                  className="ml-2 z-0 rounded-full bottom-2 border-spacing-2 shadow-2xl"
                />
                <div className="relative ml-3 font-bold text-xl border-3 border-lime-500 italic z-50">
                  <span className="text-xl font-bold italic">
                    Kis@rr<span className="text-orange-500">-WEB</span>
                  </span>
                  <div className="absolute top-[0] left-[70%] bg-transparent text-orange-500  rounded-3xl p-1">
                    <SatelliteDish className="h-8 w-8" />
                  </div>
                  <hr className="border-b-2 border-orange-500 w-[160px]" />
                  <span className="text-md font-light">
                    <p className="mt-1 text-sm">sarrsindian@gmail.com</p>
                  </span>
                  <p className="mt-2">Woury Shop - Bignona</p>
                </div>
              </div>
              {/* <h1 className="text-4xl mt-4 font-bold">Facture</h1> */}
            </div>
            <div className="text-right">
              <p className="badge badge-info mb-2 px-2 py-3 text-pretty font-bold ">
                Facture n° : {invoice.id}
              </p>
              <p className="my-1">
                <strong>Date </strong>
                {formatDate(invoice.invoiceDate)}
              </p>
              <p>
                <strong>Date d&apos;échéance </strong>
                {formatDate(invoice.dueDate)}
              </p>
              <p className="my-4">
                <strong>Client  </strong> {invoice.clientName} - {invoice.clientAddress}
              </p>
            </div>
          </div>
          <hr />
          <hr className="border border-2 border-gray-900" />
          <div className="overflow-x-auto">
            <table className="table table-zebra text-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoice.lines.map((ligne, index) => (
                  <tr key={index + 1}>
                    <td className="mb-1 py-0">{index + 1}</td>
                    <td className="mb-1 py-0">{ligne.description}</td>
                    <td className="mb-1 py-0">{ligne.quantity}</td>
                    <td className="mb-1 py-0">
                      {ligne.unitPrice }
                    </td>
                    <td className="mb-1 py-1">
                      {(ligne.quantity > 0) ? (ligne.quantity * ligne.unitPrice) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 text-md">
            {/* <div className="flex justify-between">
              <div className="font-bold">Total Hors Taxes</div>
              <div>{totals.totalHT.toFixed(0)} xof</div>
            </div> */}

            {/* {invoice.vatActive && (
              <div className="flex justify-between">
                <div className="font-bold">TVA {invoice.vatRate} %</div>
                <div>{totals.totalVAT.toFixed(0)} xof</div>
              </div>
            )} */}

            <div className="flex justify-between">
              <div className="font-bold">Total à payer</div>
              <div className="badge bg-black px-4 py-1">
                <p className="badge badge-white mb-1 p-2 text-pretty font-bold">
                  {totals.totalTTC.toFixed(0)} xof
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;
