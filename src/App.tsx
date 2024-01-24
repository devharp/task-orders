// mail: harilalrafaliya@gmail.com
import './App.css'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';
import { Toast } from 'primereact/toast';
import { FormEvent, MutableRefObject, Ref, useEffect, useRef, useState } from 'react';

interface ProductType {
  product: string;
  email: string; price: string;
  quantity: string; city: string;
  id: string; state: string; zipCode: string
}

function App() {
  const appTableKey = useState<string>(generateRandomId());
  const [prodItem, setProdItem] = useState<ProductType | undefined>(undefined);
  const [formVisibility, setFormVisibility] = useState<boolean>(false);

  function AppInputField({ label, placeholder, required, className, type, aRef, value }: { label: string, placeholder: string, required?: boolean, className?: string, type: string, aRef: MutableRefObject<string | null>, value: string }) {
    const ref = aRef as unknown as Ref<HTMLInputElement> | undefined;
    return (
      <div className={'flex flex-col gap-[0.5rem] ' + (className + '')}>
        <div className='text-[1.75rem] text-[rgb(0,0,0,0.75)]'>{label || 'Label'}{required && <span className='text-[red]'>*</span>}</div>
        <InputText ref={ref} type={type} required={true} defaultValue={value} placeholder={placeholder || 'placeholder'} className='text-[2rem] px-[1rem_!important] py-[0.5rem_!important] w-[100%]' />
      </div>
    );
  }

  function AppDropdownField({ label, placeholder, required, className, options, aRef, defaultValue }: { label: string, placeholder: string, required?: boolean, className?: string, options: SelectItemOptionsType, aRef: MutableRefObject<any | null>, defaultValue: SelectItem }) {
    const [selected, setSelected] = useState<string | null>(defaultValue?.value || null);
    return (
      <div className={'flex flex-col gap-[0.5rem] ' + (className + '')}>
        <div className='text-[1.75rem] text-[rgb(0,0,0,0.75)]'>{label || 'Label'}{required && <span className='text-[red]'>*</span>}</div>
        <Dropdown required={true} placeholder={placeholder || 'placeholder'} className='[&>.p-dropdown-label]:text-[2rem] px-[1rem_!important] py-[0.5rem_!important] w-[100%]'
          ref={aRef}
          value={selected}
          options={options}
          onChange={(e) => setSelected(e.value)}
        />
      </div>
    );
  }

  function AppButton({ label }: { label: string }) {
    return <input type='submit' value={label || 'Label'} className='app-button' />
  }

  function AppButton2({ label, onClick, className }: { label: string, onClick?: () => void, className?: string }) {

    function onClickHandler() {
      if (onClick) { onClick(); }
    }
    return <button onClick={onClickHandler} className={'app-button ' + (className || '')}>{label || 'Label'}</button>
  }

  function AppProdTable({onItemEvent}: { onItemEvent: (type: 'edit' | 'delete' | 'add', item: ProductType | undefined) => void }) {
    const products: Array<ProductType> = JSON.parse(localStorage.getItem('products') || '[]');

    function onItemEventHandler(type: 'edit' | 'delete' | 'add', item: ProductType | undefined) {
        if (onItemEvent) { onItemEvent(type, item); }
    }


    return (
      <div>

        <table className='text-[2rem]' style={{ borderCollapse: 'separate', borderSpacing: '1rem' }}>
          <thead>

            <tr>
              <th>Product</th>
              <th>Email</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {
              products.map((item: ProductType, index: number) =>

                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.email}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.city}</td>
                  <td>{item.state}</td>
                  <td>{item.zipCode}</td>
                  <td>
                    <div className='flex justify-center gap-[1rem]'>
                      <AppButton2 onClick={() => onItemEventHandler('edit', item)} className='w-[10rem]' label='edit' />
                      <AppButton2 onClick={() => onItemEventHandler('delete', item)} className='w-[10rem]' label='delete' />
                    </div>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>

        <div className='w-[100%] flex justify-center'>

          <AppButton2 onClick={() => onItemEventHandler('add', undefined)} className='w-[10rem] bg-[rgb(50,50,100)_!important]' label='Add' />
        </div>
      </div>
    );
  }

  function itemEventHandler(type: 'edit' | 'delete' | 'add', item: ProductType | undefined) {
    
    console.log({ type, item });

    if (type === 'add' && item === undefined) {
      setFormVisibility(true); setProdItem(undefined);
    }

    else if (type === 'edit' && item) {
      setFormVisibility(true); setProdItem(item);
    }

    else if (type === 'delete' && item) {
      let products: Array<ProductType> = JSON.parse(localStorage.getItem('products') || '[]');
      products = products.filter((product: ProductType) => (product.id !== item.id));
      localStorage.setItem('products', JSON.stringify(products));
      appTableKey[1](() => generateRandomId());
      
    }
  }

  function ProductForm({ item }: { item?: ProductType }) {
    const toast = useRef<Toast>(null);
    const appForm = useRef<HTMLFormElement | null>(null);
    const productNameRef = useRef<string | null>(null);
    const emailRef = useRef<string | null>(null);
    const priceRef = useRef<string | null>(null);
    const quantRef = useRef<string | null>(null);
    const cityRef = useRef<string | null>(null);
    const stateRef = useRef<string | null>(null);
    const zipCodeRef = useRef<string | null>(null);

    const showToast = (detail: string, type?: "success" | "info" | "warn" | "error" | undefined, summary?: string | null) => {
      if (!toast?.current) { return; }
      toast.current.show({
        severity: type || 'error',
        summary: summary || 'Error',
        detail: detail || 'This is a PrimeReact Popup!',
        life: 3000, // Duration in milliseconds
      });
    };

    const options: SelectItemOptionsType = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];

    function onAppFormSubmit(event: FormEvent) {
      event.preventDefault();
    }

    function onSubmitForm() {
      let error: boolean = false;

      const product = (productNameRef as unknown as any)?.current?.value;
      if (product?.length === 0) {
        showToast('Product Name required');
        error = true;
      }

      const email = (emailRef as unknown as any)?.current?.value;
      if (email?.length === 0) {
        showToast('Email required'); error = true;
      }

      const emailRegEx = /[a-zA-Z0-9]*?@[a-zA-Z0-9]*?\.[a-zA-Z0-9]*/.test(email);
      if (!emailRegEx) {
        showToast('Please Check the Email'); error = true;
      }

      const price = (priceRef as unknown as any)?.current?.value;
      if (price?.length === 0) {
        showToast('Price required'); error = true;
      }

      const quantity = (quantRef as unknown as any)?.current?.value;
      if (quantity?.length === 0) {
        showToast('Quantity required'); error = true;
      }

      const city = (cityRef as unknown as any)?.current?.props?.value;
      if (!city) {
        showToast('City required'); error = true;
      }

      const state = (stateRef as unknown as any)?.current?.props?.value;
      if (!state) {
        showToast('State required'); error = true;
      }

      const zipCode = (zipCodeRef as unknown as any)?.current?.value;
      if (zipCode?.length === 0) {
        showToast('Zip Code required'); error = true;
      }

      else if (zipCode?.length !== 6) {
        showToast('Zip Code length must be 6'); error = true;
      }


      if (!error) {
        const payload = {
          product, email, price, quantity, city, state, zipCode, id: item?.id || generateRandomId()
        }

        let products: Array<ProductType> = JSON.parse(localStorage.getItem('products') || '[]');
        if (item?.id) {
          products = products.map((item$: ProductType) => {
            if (payload.id === item$.id) {
              return payload;
            }
            return item$;
          });
          showToast('Edited the order', 'success', 'Success')
        }
        else {
          products.push(payload);
          showToast('Saving the order', 'success', 'Success')
        }

        localStorage.setItem('products', JSON.stringify(products));
        setFormVisibility(false);

      }

    }
    return <div className='w-[100%] flex justify-center pt-[5rem_!important]'>
      <form ref={appForm} onSubmit={onAppFormSubmit}>
        <div className=' max-w-[500px] flex flex-col gap-[1.5rem]'>
          <AppInputField value={item?.product || ''} aRef={productNameRef} type='string' label='Product Name' placeholder='Product Name' required={true} />
          <AppInputField value={item?.email || ''} aRef={emailRef} type='email' label='Email' placeholder='test@email.com' required={true} />
          <div className='flex gap-[1rem]'>
            <AppInputField value={item?.price || ''} aRef={priceRef} type='number' className='flex-grow' label='Price' placeholder='Price' />
            <AppInputField value={item?.quantity || ''} aRef={quantRef} type='number' label='Quantity' placeholder='Quantity' className='w-[12rem]' />
          </div>
          <div className='flex gap-[1.5rem]'>
            <AppDropdownField defaultValue={options.find(({value}) => (value === item?.city)) || null} aRef={cityRef} label='City' placeholder='city' options={options} className='w-[33%]' />
            <AppDropdownField defaultValue={options.find(({value}) => (value === item?.state)) || null} aRef={stateRef} label='State' placeholder='state' options={options} className='w-[33%]' />
            <AppInputField value={item?.zipCode || ''} aRef={zipCodeRef} type='number' label='Zip Code' placeholder='zip code' className='w-[12rem]' />
          </div>
          <input type='submit' value='Place Order' className='app-button' onClick={onSubmitForm} />

        </div>
      </form>

      <Toast className='text-[1.5rem]' ref={toast} />
    </div>
  }
  return (
    <div>
      <AppProdTable onItemEvent={itemEventHandler} key={appTableKey[0]} />
      { formVisibility && <ProductForm item={prodItem} /> }

    </div>
  )
}
const generateRandomId = (length: number = 8): string => [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');



export default App
