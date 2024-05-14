import { Table } from 'rsuite';
const { Column, Cell, HeaderCell } = Table;

const TableComponent = ({ data, config, actions, content, loading, onRowClick }) => {
    return (
        <Table loading={loading} data={data} height={300} onRowClick={onRowClick}>
        {config.map((c, index) => (
    <Column key={index} flexGrow={!c.width ? 1 : 0} width={c.width} fixed={c.fixed} >
        <HeaderCell>{c.label}</HeaderCell>
        {!c.content ? (
        <Cell dataKey={c.key} />
        ) : (
        <Cell>{(item) => c.content(item)}</Cell>
        )} 
    </Column>
))}
        <Column width={100} fixed="right" >
                <HeaderCell>Ações</HeaderCell>
                <Cell>{(item) => actions(item)}</Cell>
            </Column>
    </Table>
    );
};

export default TableComponent;
