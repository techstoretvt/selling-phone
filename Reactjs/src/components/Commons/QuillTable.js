import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');
const Delta = Quill.import('delta');

class TableBlot extends BlockEmbed {
    static create() {
        const node = super.create();
        node.innerHTML = `<table><tbody><tr><td><br></td></tr></tbody></table>`;
        return node;
    }

    static value() {
        return new Delta().insert({ table: null });
    }
}
TableBlot.blotName = 'table';
TableBlot.tagName = 'div';
Quill.register(TableBlot);

export default Quill;