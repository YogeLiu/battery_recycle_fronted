import { forwardRef } from 'react';
import { OutboundOrderDetailResponse } from '../../types';

interface PrintableOutboundOrderProps {
  orderDetail: OutboundOrderDetailResponse;
}

const PrintableOutboundOrder = forwardRef<HTMLDivElement, PrintableOutboundOrderProps>(
  ({ orderDetail }, ref) => {
    // 数字转中文大写金额
    const convertToChineseAmount = (amount: number): string => {
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
      
      if (amount === 0) return '零元整';
      
      const integerPart = Math.floor(amount);
      const decimalPart = Math.round((amount - integerPart) * 100);
      
      let result = '';
      const intStr = integerPart.toString();
      
      // 处理整数部分
      for (let i = 0; i < intStr.length; i++) {
        const digit = parseInt(intStr[i]);
        const unitIndex = intStr.length - i - 1;
        
        if (digit !== 0) {
          result += digits[digit] + units[unitIndex];
        } else if (result && !result.endsWith('零')) {
          result += '零';
        }
      }
      
      result = result.replace(/零+$/g, '') + '元';
      
      // 处理小数部分
      if (decimalPart > 0) {
        const jiao = Math.floor(decimalPart / 10);
        const fen = decimalPart % 10;
        
        if (jiao > 0) result += digits[jiao] + '角';
        if (fen > 0) result += digits[fen] + '分';
      } else {
        result += '整';
      }
      
      return result;
    };

    // 计算总重量
    const totalWeight = orderDetail.detail.reduce((sum, item) => sum + item.weight, 0);

    return (
      <div ref={ref} className="print-container">
        <div className="copy-section">
          <div className="print-header">
            <h1 className="print-title">张家口悦翰新能源科技有限公司出库单</h1>
            <div className="header-info-grid">
              <div className="info-item">
                <span className="label">送货地：</span>
                <span className="value">{orderDetail.order.delivery_address}</span>
              </div>
              <div className="info-item">
                <span className="label">时间：</span>
                <span className="value date-text">{new Date(orderDetail.order.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="info-item">
                <span className="label">订单号：</span>
                <span className="value order-no">{orderDetail.order.order_no}</span>
              </div>
            </div>
            <div className="driver-info-grid-three">
              <div className="info-item">
                <span className="label">司机：</span>
                <span className="value">{orderDetail.order.driver_name}</span>
              </div>
              <div className="info-item">
                <span className="label">车牌号：</span>
                <span className="value">{orderDetail.order.car_number}</span>
              </div>
              <div className="info-item">
                <span className="label">电话：</span>
                <span className="value">{orderDetail.order.driver_phone}</span>
              </div>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>序号</th>
                <th style={{ width: '40%' }}>电池分类</th>
                <th style={{ width: '20%' }}>重量(KG)</th>
                <th style={{ width: '15%' }}>单价(元/KG)</th>
                <th style={{ width: '15%' }}>金额(元)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.detail.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.category_name}</td>
                  <td className="weight">{item.weight.toFixed(2)}</td>
                  <td>¥{item.unit_price.toFixed(2)}</td>
                  <td className="sub-total">¥{item.sub_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td className="total-header">合计</td>
                <td className="total-label">{convertToChineseAmount(orderDetail.order.total_amount)}</td>
                <td className="total-weight">{totalWeight.toFixed(2)}KG</td>
                <td colSpan={2} className="total-amount">¥{orderDetail.order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {orderDetail.order.notes && (
            <div className="notes-section">
              <div className="notes-label">备注：</div>
              <div className="notes-content">{orderDetail.order.notes}</div>
            </div>
          )}

        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .print-container { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: Arial, 'Microsoft YaHei', sans-serif; font-size: 14px; line-height: 1.35; color: #000; }

            .copy-section { width: 100% !important; padding: 4mm 10mm 4mm 20mm; margin: 0 auto; background: white; box-sizing: border-box; display: flex; flex-direction: column; break-inside: avoid; page-break-inside: avoid; }

            .print-header { text-align: center; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 6px; }

            .print-title { font-size: 20px; font-weight: bold; margin: 0 0 6px 0; letter-spacing: 1px; }

            .header-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; text-align: left; font-size: 10px; width: 100%; gap: 8px; justify-content: space-between; white-space: nowrap; margin-bottom: 4px; }

            .driver-info-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; text-align: left; font-size: 10px; width: 100%; gap: 8px; white-space: nowrap; justify-content: space-between; }

            .driver-info-grid-three { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; text-align: left; font-size: 10px; width: 100%; gap: 8px; white-space: nowrap; justify-content: space-between; }

            .info-item {
              display: flex;
              align-items: center;
            }

            .label {
              font-weight: bold;
              margin-right: 3px;
              min-width: auto;
              white-space: nowrap;
            }

            .value { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            .order-no { font-family: monospace; font-size: 12px; overflow: visible; word-break: break-all; min-width: max-content; }

            .print-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 12px; }

            .print-table th, .print-table td { border: 1px solid #000; padding: 4px 3px; text-align: center; vertical-align: middle; }

            .print-table th { font-weight: bold; font-size: 11px; padding: 2px 3px; line-height: 1.15; }

            .print-table tbody tr { page-break-inside: avoid; }

            .weight { font-weight: bold; color: #000; }
            .sub-total { font-weight: bold; }
            .total-row { font-weight: bold; }
            .total-row td { padding: 1px 2px; line-height: 1.1; }
            .total-header { text-align: center; font-size: 12px; font-weight: bold; }
            .total-label { text-align: left; font-size: 11px; font-weight: bold; }
            .total-weight { font-weight: bold; color: #000; font-size: 12px; }
            .total-amount { font-size: 12px; color: #000; font-weight: bold; text-align: center; }

            .notes-section { margin: 6px 0; border: 1px solid #000; padding: 6px; min-height: 14px; font-size: 11px; }

            .notes-label { font-weight: bold; margin-bottom: 4px; }
            .notes-content { line-height: 1.4; }

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
              .header-info-grid { font-size: 10px !important; gap: 8px !important; }
              .driver-info-grid { font-size: 10px !important; gap: 8px !important; }
              .driver-info-grid-three { font-size: 10px !important; gap: 8px !important; }
              .order-no { font-size: 12px !important; }
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

PrintableOutboundOrder.displayName = 'PrintableOutboundOrder';

export default PrintableOutboundOrder;