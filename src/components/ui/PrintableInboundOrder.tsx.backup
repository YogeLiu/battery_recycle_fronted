import React, { forwardRef } from 'react';
import { InboundOrderDetailResponse } from '../../types';

interface PrintableInboundOrderProps {
  orderDetail: InboundOrderDetailResponse;
}

const PrintableInboundOrder = forwardRef<HTMLDivElement, PrintableInboundOrderProps>(
  ({ orderDetail }, ref) => {

    return (
      <div ref={ref} className="print-container">
        <div className="single-page">
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
                <span className="value">{new Date(orderDetail.order.created_at).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>序号</th>
                <th style={{ width: '25%' }}>电池分类</th>
                <th style={{ width: '12.5%' }}>毛重(KG)</th>
                <th style={{ width: '12.5%' }}>皮重(KG)</th>
                <th style={{ width: '12.5%' }}>净重(KG)</th>
                <th style={{ width: '15.7%' }}>单价(元/KG)</th>
                <th style={{ width: '16.8%' }}>小计(元)</th>
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
                <span>制单人：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>审核人：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>收货人：</span>
                <span className="signature-line"></span>
              </div>
              <div className="signature-item">
                <span>客户签收：</span>
                <span className="signature-line"></span>
              </div>
            </div>

          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .print-container {
              font-family: Arial, 'Microsoft YaHei', sans-serif;
              font-size: 12px;
              line-height: 1.3;
              color: #000;
            }

            .single-page {
              width: 210mm;
              height: 84mm;
              padding: 2mm 5mm 2mm 25mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }

            .print-header {
              text-align: center;
              margin-bottom: 6px;
              border-bottom: 2px solid #000;
              padding-bottom: 4px;
            }

            .print-title {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 4px 0;
              letter-spacing: 1px;
            }

            .order-info-grid {
              display: flex;
              justify-content: space-between;
              align-items: center;
              text-align: left;
              font-size: 10px;
            }

            .info-item {
              display: flex;
              align-items: center;
            }

            .label {
              font-weight: bold;
              margin-right: 4px;
              min-width: 50px;
            }

            .value {
              flex: 1;
            }

            .order-no {
              font-family: monospace;
              font-weight: bold;
              font-size: 11px;
            }

            .total-highlight {
              font-weight: bold;
              font-size: 18px;
              color: #e74c3c;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 4px 0;
              font-size: 9px;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #000;
              padding: 3px 2px;
              text-align: center;
              vertical-align: middle;
            }

            .print-table th {
              background-color: #f8f8f8;
              font-weight: bold;
              font-size: 7px;
              padding: 1px 2px;
              line-height: 1.1;
            }

            .net-weight {
              font-weight: bold;
              color: #000;
            }

            .sub-total {
              font-weight: bold;
            }

            .total-row {
              font-weight: bold;
              background-color: #f0f0f0;
            }

            .total-row td {
              padding: 1px 2px;
              line-height: 1.1;
            }

            .total-label {
              text-align: right;
              font-size: 8px;
              font-weight: bold;
            }

            .total-amount {
              font-size: 9px;
              color: #000;
              font-weight: bold;
            }

            .notes-section {
              margin: 3px 0;
              border: 1px solid #000;
              padding: 3px;
              min-height: 12px;
              font-size: 9px;
            }

            .notes-label {
              font-weight: bold;
              margin-bottom: 4px;
            }

            .notes-content {
              line-height: 1.4;
            }

            .signature-section {
              margin-top: auto;
              padding-top: 4px;
            }

            .signature-row {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 4px;
              font-size: 9px;
            }

            .signature-item {
              display: flex;
              align-items: center;
              gap: 4px;
            }

            .signature-line {
              display: inline-block;
              width: 35px;
              border-bottom: 1px solid #000;
              height: 12px;
            }

            @media print {
              @page {
                size: 240mm 90mm;
                margin: 0 5mm 0 25mm;
                orientation: portrait;
              }
              
              .print-container {
                font-size: 12px !important;
              }
              
              .single-page {
                width: 210mm;
                height: 84mm;
                padding: 2mm 5mm 2mm 25mm;
                margin: 0;
                page-break-inside: avoid;
                display: flex;
                flex-direction: column;
              }
              
              .print-table {
                font-size: 9px !important;
              }
              
              .print-table th {
                font-size: 7px !important;
                padding: 1px 2px !important;
                line-height: 1.1 !important;
              }
              
              .print-table th,
              .print-table td {
                padding: 3px 2px !important;
              }
              
              .total-row td {
                padding: 1px 2px !important;
                line-height: 1.1 !important;
              }
              
              .print-title {
                font-size: 16px !important;
              }
              
              .order-info-grid {
                font-size: 10px !important;
              }
              
              .order-no {
                font-size: 11px !important;
              }
              
              .signature-row {
                font-size: 9px !important;
              }
              
              .notes-section {
                font-size: 9px !important;
              }
              
              .total-label {
                font-size: 8px !important;
              }
              
              .total-amount {
                font-size: 9px !important;
              }
            }
          `
        }} />
      </div>
    );
  }
);

PrintableInboundOrder.displayName = 'PrintableInboundOrder';

export default PrintableInboundOrder;