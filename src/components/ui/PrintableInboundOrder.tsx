import React, { forwardRef } from 'react';
import { InboundOrderDetailResponse } from '../../types';

interface PrintableInboundOrderProps {
  orderDetail: InboundOrderDetailResponse;
}

const PrintableInboundOrder = forwardRef<HTMLDivElement, PrintableInboundOrderProps>(
  ({ orderDetail }, ref) => {
    return (
      <div ref={ref} className="print-container">
        <div className="copy-section">
          <div className="print-header">
            <h1 className="print-title">张家口悦翰新能源有限公司入库单</h1>
            <div className="order-info-grid">
              <div className="info-item">
                <span className="label">订单号：</span>
                <span className="value order-no">{orderDetail.order.order_no}</span>
              </div>
              <div className="info-item">
                <span className="label">供应商：</span>
                <span className="value">{orderDetail.order.supplier_name}</span>
              </div>
              <div className="info-item">
                <span className="label">创建时间：</span>
                <span className="value date-text">{new Date(orderDetail.order.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '7%' }}>序号</th>
                <th style={{ width: '22%' }}>电池分类</th>
                <th style={{ width: '12.5%' }}>毛重(KG)</th>
                <th style={{ width: '15%' }}>皮重(KG)</th>
                <th style={{ width: '12.5%' }}>净重(KG)</th>
                <th style={{ width: '18%' }}>单价(元/KG)</th>
                <th style={{ width: '13%' }}>小计(元)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.detail.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.category_name}</td>
                  <td>{item.gross_weight.toFixed(2)}</td>
                  <td>{item.tare_weight.toFixed(2)}</td>
                  <td className="net-weight">{item.net_weight.toFixed(2)}</td>
                  <td>¥{item.unit_price.toFixed(2)}</td>
                  <td className="sub-total">¥{item.sub_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={6} className="total-label">合计金额：</td>
                <td className="total-amount">¥{orderDetail.order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {orderDetail.order.notes && (
            <div className="notes-section">
              <div className="notes-label">备注：</div>
              <div className="notes-content">{orderDetail.order.notes}</div>
            </div>
          )}

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-item">
                <span>审核人：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>收货人：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>客户：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>制单：</span>
                <span className="signature-line"></span>
              </div>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .print-container { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: Arial, 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 1.35; color: #000; }

            .copy-section { width: 100% !important; padding: 4mm 10mm 4mm 20mm; margin: 0 auto; background: white; box-sizing: border-box; display: flex; flex-direction: column; break-inside: avoid; page-break-inside: avoid; }

            /* no separator needed for physical 3-part paper */

            .print-header { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 6px; }

            .print-title { font-size: 20px; font-weight: bold; margin: 0 0 6px 0; letter-spacing: 1px; }

            .order-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; text-align: left; font-size: 11px; width: 100%; gap: 10px; }

            /* removed copy label */

            .info-item {
              display: flex;
              align-items: center;
            }

            .label {
              font-weight: bold;
              margin-right: 4px;
              min-width: 50px;
            }

            .value { flex: 1; }

            .order-no { font-family: monospace; font-weight: bold; font-size: 12px; }

            .print-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 12px; }

            .print-table th, .print-table td { border: 1px solid #000; padding: 4px 3px; text-align: center; vertical-align: middle; }

            .print-table th { font-weight: bold; font-size: 11px; padding: 2px 3px; line-height: 1.15; }

            .print-table tbody tr { page-break-inside: avoid; }

            .net-weight { font-weight: bold; color: #000; }
            .sub-total { font-weight: bold; }
            .total-row { font-weight: bold; }
            .total-row td { padding: 1px 2px; line-height: 1.1; }
            .total-label { text-align: right; font-size: 11px; font-weight: bold; }
            .total-amount { font-size: 12px; color: #000; font-weight: bold; }

            .notes-section { margin: 6px 0; border: 1px solid #000; padding: 6px; min-height: 14px; font-size: 11px; }

            .notes-label { font-weight: bold; margin-bottom: 4px; }
            .notes-content { line-height: 1.4; }

            .signature-section {
              margin-top: auto;
              padding-top: 4px;
              page-break-inside: avoid;
            }

            .signature-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-top: 8px; font-size: 10px; }

            .signature-item { display: flex; align-items: center; gap: 4px; }
            .signature-line { display: inline-block; width: 60px; border-bottom: 1px solid #000; height: 14px; }
            .date-text { font-size: 10px; color: #000; }

            @media print {
              @page { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 6mm 10mm 6mm 20mm; }

              .print-container { font-size: 14px !important; }

              .copy-section { width: 100% !important; padding: 4mm 10mm 4mm 20mm; margin: 0; page-break-inside: avoid; display: flex; flex-direction: column; }

              .print-table { font-size: 12px !important; }
              .print-table thead { display: table-header-group; }
              .print-table tbody tr { page-break-inside: avoid !important; }
              .print-table tfoot { display: table-footer-group; }
              .print-table th { font-size: 11px !important; padding: 2px 3px !important; line-height: 1.15 !important; }
              .print-table th, .print-table td { padding: 4px 3px !important; }
              .total-row td { padding: 2px 3px !important; line-height: 1.15 !important; }
              .print-title { font-size: 20px !important; }
              .order-info-grid { font-size: 11px !important; }
              .order-no { font-size: 12px !important; }
              .signature-row { font-size: 10px !important; }
              .signature-section { page-break-inside: avoid !important; }
              .date-text { font-size: 10px !important; }
              .notes-section { font-size: 11px !important; }
              .total-label { font-size: 11px !important; }
              .total-amount { font-size: 12px !important; }
            }
          `
        }} />
      </div>
    );
  }
);

PrintableInboundOrder.displayName = 'PrintableInboundOrder';

export default PrintableInboundOrder;