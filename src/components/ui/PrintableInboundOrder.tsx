import React, { forwardRef } from 'react';
import { InboundOrderDetailResponse } from '../../types';

interface PrintableInboundOrderProps {
  orderDetail: InboundOrderDetailResponse;
}

const PrintableInboundOrder = forwardRef<HTMLDivElement, PrintableInboundOrderProps>(
  ({ orderDetail }, ref) => {
    const printDate = new Date().toLocaleString('zh-CN');
    
    return (
      <div ref={ref} className="print-container">
        <div className="single-page">
          <div className="print-header">
            <h1 className="print-title">进销存入库单</h1>
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
              <div className="info-item">
                <span className="label">状态：</span>
                <span className="value">{orderDetail.order.status === 'completed' ? '已完成' : '处理中'}</span>
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{width: '8%'}}>序号</th>
                <th style={{width: '25%'}}>电池分类</th>
                <th style={{width: '12%'}}>毛重(KG)</th>
                <th style={{width: '12%'}}>皮重(KG)</th>
                <th style={{width: '12%'}}>净重(KG)</th>
                <th style={{width: '15%'}}>单价(元/KG)</th>
                <th style={{width: '16%'}}>小计(元)</th>
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
            <div className="print-time">打印时间：{printDate}</div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .print-container {
              font-family: Arial, 'Microsoft YaHei', sans-serif;
              font-size: 9px;
              line-height: 1.2;
              color: #000;
            }

            .single-page {
              width: 240mm;
              height: 90mm;
              padding: 4mm 15mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
            }

            .print-header {
              text-align: center;
              margin-bottom: 6px;
              border-bottom: 2px solid #000;
              padding-bottom: 4px;
            }

            .print-title {
              font-size: 12px;
              font-weight: bold;
              margin: 0 0 4px 0;
              letter-spacing: 1px;
            }

            .order-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 8px;
              text-align: left;
              font-size: 7px;
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
              font-size: 8px;
            }

            .total-highlight {
              font-weight: bold;
              font-size: 16px;
              color: #e74c3c;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 4px 0;
              font-size: 6px;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #000;
              padding: 2px 1px;
              text-align: center;
              vertical-align: middle;
            }

            .print-table th {
              background-color: #f8f8f8;
              font-weight: bold;
              font-size: 6px;
            }

            .net-weight {
              font-weight: bold;
              color: #2980b9;
            }

            .sub-total {
              font-weight: bold;
            }

            .total-row {
              font-weight: bold;
              background-color: #f0f0f0;
            }

            .total-label {
              text-align: right;
              font-size: 8px;
              font-weight: bold;
            }

            .total-amount {
              font-size: 9px;
              color: #e74c3c;
              font-weight: bold;
            }

            .notes-section {
              margin: 3px 0;
              border: 1px solid #000;
              padding: 2px;
              min-height: 12px;
              font-size: 6px;
            }

            .notes-label {
              font-weight: bold;
              margin-bottom: 3px;
            }

            .notes-content {
              line-height: 1.4;
            }

            .signature-section {
              margin-top: 6px;
            }

            .signature-row {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr 1fr;
              gap: 8px;
              margin-bottom: 4px;
              font-size: 6px;
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

            .print-time {
              text-align: right;
              font-size: 6px;
              color: #666;
            }


            @media print {
              @page {
                size: 240mm 90mm;
                margin: 0;
                orientation: landscape;
              }
              
              .print-container {
                font-size: 7px !important;
              }
              
              .single-page {
                width: 240mm;
                height: 90mm;
                padding: 4mm 15mm;
                margin: 0;
                page-break-inside: avoid;
              }
              
              .print-table {
                font-size: 5px !important;
              }
              
              .print-table th {
                font-size: 5px !important;
              }
              
              .print-table th,
              .print-table td {
                padding: 1px !important;
              }
              
              .print-title {
                font-size: 10px !important;
              }
              
              .order-info-grid {
                font-size: 6px !important;
              }
              
              .order-no {
                font-size: 6px !important;
              }
              
              .signature-row {
                font-size: 5px !important;
              }
              
              .notes-section {
                font-size: 5px !important;
              }
              
              .total-label {
                font-size: 6px !important;
              }
              
              .total-amount {
                font-size: 7px !important;
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