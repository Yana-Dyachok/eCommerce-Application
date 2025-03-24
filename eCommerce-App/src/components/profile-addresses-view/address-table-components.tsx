import { useNavigate } from 'react-router-dom';
import { BaseAddress } from '@commercetools/platform-sdk';
import styles from './addresses-view-style.module.css';

interface ColumnInterface {
  label: string;
  id: string;
}

export function TableHead({ mainColumns }: { mainColumns: ColumnInterface[] }) {
  return (
    <thead className={styles.tableHead}>
      <tr>
        {mainColumns.map((column) => (
          <th
            key={column.id}
            id={column.id}
            className={styles.userTableHeadCell}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TableContent({
  entries,
  tableColumns,
  shippingAddressIds,
  billingAddressIds,
  defaultBillingAddressId,
  defaultShippingAddressId,
}: {
  entries: BaseAddress[];
  tableColumns: ColumnInterface[];
  shippingAddressIds: string[];
  billingAddressIds: string[];
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
}) {
  const navigate = useNavigate();
  return (
    <tbody>
      {entries.map((entry, index) => {
        return (
          <tr
            onClick={() => {
              navigate(`${entry.id}`);
            }}
            id={entry.id}
            key={entry.id}
            className={styles.tableBodyRow}
          >
            {tableColumns.map((column) => {
              return column.id === 'addressType' ? (
                <td
                  key={column.id}
                  className={styles.userTableBodyCell}
                  data-cell={column.label}
                >
                  <div className={styles.addressTypes}>
                    {defaultBillingAddressId === entry.id ? (
                      <div className={styles.defaultType}>Default billing</div>
                    ) : null}
                    {defaultShippingAddressId === entry.id ? (
                      <div className={styles.defaultType}>Default shipping</div>
                    ) : null}
                    {shippingAddressIds?.map((elem) => {
                      return elem === entry.id ? (
                        <div className={styles.addressType} key={elem}>
                          Shipping
                        </div>
                      ) : null;
                    })}
                    {billingAddressIds?.map((elem) => {
                      return elem === entry.id ? (
                        <div className={styles.addressType} key={elem}>
                          Billing
                        </div>
                      ) : null;
                    })}
                  </div>
                </td>
              ) : (
                <td
                  data-cell={column.label}
                  className={styles.userTableBodyCell}
                  key={column.id}
                >
                  {column.id === 'id'
                    ? index + 1
                    : entry[column.id as keyof BaseAddress]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
