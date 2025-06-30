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
        {/* 第一联：存根联 */}
        <div className="print-page">
          <div className="print-header">
            <h1 className="print-title">进销存入库单（存根联）</h1>
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
                <th style={{width: '6%'}}>序号</th>
                <th style={{width: '20%'}}>电池分类</th>
                <th style={{width: '12%'}}>毛重(KG)</th>
                <th style={{width: '12%'}}>皮重(KG)</th>
                <th style={{width: '12%'}}>净重(KG)</th>
                <th style={{width: '16%'}}>单价(元/KG)</th>
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
                <span className="signature-line">________________</span>
              </div>
              <div className="signature-item">
                <span>审核人：</span>
                <span className="signature-line">________________</span>
              </div>
              <div className="signature-item">
                <span>收货人：</span>
                <span className="signature-line">________________</span>
              </div>
            </div>
            <div className="print-time">打印时间：{printDate}</div>
          </div>
        </div>

        {/* 分页符 */}
        <div className="page-break"></div>

        {/* 第二联：记账联 */}
        <div className="print-page">
          <div className="print-header">
            <h1 className="print-title">进销存入库单（记账联）</h1>
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
                <span className="label">总金额：</span>
                <span className="value total-highlight">¥{orderDetail.order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <table className="print-table simplified">
            <thead>
              <tr>
                <th style={{width: '8%'}}>序号</th>
                <th style={{width: '30%'}}>电池分类</th>
                <th style={{width: '16%'}}>净重(KG)</th>
                <th style={{width: '20%'}}>单价(元/KG)</th>
                <th style={{width: '20%'}}>小计(元)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.detail.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.category_name}</td>
                  <td className="net-weight">{item.net_weight.toFixed(2)}</td>
                  <td>¥{item.unit_price.toFixed(2)}</td>
                  <td className="sub-total">¥{item.sub_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={4} className="total-label">合计金额：</td>
                <td className="total-amount">¥{orderDetail.order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-item">
                <span>经办人：</span>
                <span className="signature-line">________________</span>
              </div>
              <div className="signature-item">
                <span>财务：</span>
                <span className="signature-line">________________</span>
              </div>
            </div>
          </div>
        </div>

        {/* 分页符 */}
        <div className="page-break"></div>

        {/* 第三联：客户联 */}
        <div className="print-page">
          <div className="print-header">
            <h1 className="print-title">进销存入库单（客户联）</h1>
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
                <span className="label">入库时间：</span>
                <span className="value">{new Date(orderDetail.order.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">商品种类：</span>
                <span className="summary-value">{orderDetail.detail.length} 种</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">总净重：</span>
                <span className="summary-value">
                  {orderDetail.detail.reduce((total, item) => total + item.net_weight, 0).toFixed(2)} KG
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">总金额：</span>
                <span className="summary-value total-highlight">¥{orderDetail.order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="detail-list">
            {orderDetail.detail.map((item, index) => (
              <div key={index} className="detail-item">
                <span className="item-name">{item.category_name}</span>
                <span className="item-weight">{item.net_weight.toFixed(2)}KG</span>
                <span className="item-amount">¥{item.sub_total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-item">
                <span>客户签收：</span>
                <span className="signature-line">________________</span>
              </div>
              <div className="signature-item">
                <span>日期：</span>
                <span className="signature-line">________________</span>
              </div>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .print-container {
              font-family: Arial, 'Microsoft YaHei', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
            }

            .print-page {
              width: 210mm;
              min-height: 297mm;
              padding: 15mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
            }

            .page-break {
              page-break-before: always;
            }

            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }

            .print-title {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 15px 0;
              letter-spacing: 2px;
            }

            .order-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              text-align: left;
            }

            .info-item {
              display: flex;
              align-items: center;
            }

            .label {
              font-weight: bold;
              margin-right: 8px;
              min-width: 80px;
            }

            .value {
              flex: 1;
            }

            .order-no {
              font-family: monospace;
              font-weight: bold;
              font-size: 14px;
            }

            .total-highlight {
              font-weight: bold;
              font-size: 16px;
              color: #e74c3c;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 11px;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #000;
              padding: 8px 4px;
              text-align: center;
              vertical-align: middle;
            }

            .print-table th {
              background-color: #f8f8f8;
              font-weight: bold;
              font-size: 12px;
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
              font-size: 14px;
            }

            .total-amount {
              font-size: 16px;
              color: #e74c3c;
            }

            .notes-section {
              margin: 15px 0;
              border: 1px solid #000;
              padding: 10px;
              min-height: 40px;
            }

            .notes-label {
              font-weight: bold;
              margin-bottom: 5px;
            }

            .notes-content {
              line-height: 1.6;
            }

            .signature-section {
              margin-top: 30px;
            }

            .signature-row {
              display: flex;
              justify-content: space-around;
              margin-bottom: 20px;
            }

            .signature-item {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .signature-line {
              display: inline-block;
              width: 100px;
              border-bottom: 1px solid #000;
              height: 20px;
            }

            .print-time {
              text-align: right;
              font-size: 10px;
              color: #666;
            }

            .summary-section {
              margin: 30px 0;
              padding: 20px;
              border: 2px solid #000;
              background-color: #f9f9f9;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              text-align: center;
            }

            .summary-item {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .summary-label {
              font-size: 13px;
              margin-bottom: 8px;
            }

            .summary-value {
              font-size: 18px;
              font-weight: bold;
            }

            .detail-list {
              margin: 20px 0;
              border: 1px solid #000;
              padding: 15px;
            }

            .detail-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #ccc;
            }

            .detail-item:last-child {
              border-bottom: none;
            }

            .item-name {
              flex: 1;
              font-weight: bold;
            }

            .item-weight {
              min-width: 80px;
              text-align: center;
              color: #2980b9;
            }

            .item-amount {
              min-width: 80px;
              text-align: right;
              font-weight: bold;
            }

            @media print {
              .print-container {
                font-size: 11px;
              }
              
              .print-page {
                width: auto;
                min-height: auto;
                padding: 10mm;
                margin: 0;
                page-break-inside: avoid;
              }
              
              .page-break {
                page-break-before: always;
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