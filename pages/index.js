// pages/sudoku/index.js
import { useState, useEffect } from 'react';
import { generateSudoku, clearUserInput } from '@/utils/sudokuGenerator';
import SudokuBoard from '@/src/components/sudoku/SudokuBoard';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import LanguageSwitcher from '@/src/components/LanguageSwitcher';
import Image from 'next/image';
import useLocalStorage from '@/utils/useLocalStorage';
import { saveEncryptedToLocalStorage, getDecryptedFromLocalStorage } from '@/utils/functions';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe( process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY );

const PaymentForm = ( { onClose, onSuccess, clientSecret } ) => {
  const { t } = useTranslation( 'common' ); // Use o namespace 'common'
  const [ pay, setPay ] = useState( '' );
  const [ cancel, setCancel ] = useState( '' );
  const [ message, setMessage ] = useState( '' );
  const [ paymentError, setPaymentError ] = useState( "" );
  const [ loading, setLoading ] = useState( false );
  const [ errorMessage, setErrorMessage ] = useState( '' );
  const [ paying, setPaying ] = useState( false );

  useEffect( () => {

    if ( t ) {
      setPay( t( 'pay' ) );
      setCancel( t( 'cancel' ) );
      setPaymentError( t( 'paymentError' ) );
      setErrorMessage( t( 'errorMessage' ) );
      setPaying( t( 'paying' ) );
    }
  }, [ t ] );

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async ( event ) => {
    event.preventDefault();

    if ( !stripe || !elements ) return;

    if ( loading ) return;

    setLoading( true );

    setPaymentError( '' );

    const { error, paymentIntent } = await stripe.confirmCardPayment( clientSecret, {
      payment_method: {
        card: elements.getElement( CardElement ),
        billing_details: {
          name: 'Sudoku User',
        },
      },
    } );

    if ( error ) {
      setLoading( false );
      //console.error( 'Erro no pagamento:', error.message );
      setMessage( error.message );
    } else if ( paymentIntent.status === 'succeeded' ) {
      setLoading( false );
      const savedGame = getDecryptedFromLocalStorage( localStorage.getItem( 'sudoku' ) );
      saveEncryptedToLocalStorage( 'sudoku', { ...savedGame, config: { showErrors: true } } );
      onSuccess();
    }
  };

  return (
    <form onSubmit={ handleSubmit } className="flex flex-col gap-4 max-w-[400px]">
      <CardElement className="border border-gray-300 p-2 rounded-md" />
      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" disabled={ !stripe }>
          { loading ? paying : pay }
        </button>
        <button onClick={ onClose } className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          { cancel }
        </button>
      </div>
      {
        message && <p className="text-red-500 text-sm mt-5 break-words text-center">{ paymentError ? paymentError + ". " : "" }{ errorMessage }: { message }</p>
      }
    </form>
  );
};


export default function SudokuPage() {
  const [ difficulty, setDifficulty ] = useState( 'easy' );
  const [ game, setGame ] = useState( null );
  const [ showModal, setShowModal ] = useState( false );
  const { t } = useTranslation( 'common' ); // Use o namespace 'common'
  const [ title, setTitle ] = useState( '' );
  const [ difficul, setDifficul ] = useState( '' );
  const [ easy, setEasy ] = useState( '' );
  const [ medium, setMedium ] = useState( '' );
  const [ hard, setHard ] = useState( '' );
  const [ startGame1, setStartGame1 ] = useState( '' );
  const [ congratulations, setCongratulations ] = useState( '' );
  const [ startNewGame, setStartNewGame ] = useState( '' );
  const [ completedMessage, setCompletedMessage ] = useState( '' );
  const [ close, setClose ] = useState( '' );
  const [ currentBoard, setCurrentBoard ] = useState( null );
  const [ showModal2, setShowModal2 ] = useState( false );
  const [ titlePay, setTitlePay ] = useState( '' );
  const [ payMassage, setPayMassage ] = useState( '' );
  const [ pay, setPay ] = useState( '' );
  const getSavedGame = useLocalStorage( 'sudoku' );
  const savedGame = getDecryptedFromLocalStorage( getSavedGame );
  const [ showSavedGame, setShowSavedGame ] = useState( true );
  const [ hasSavedGame, setHasSavedGame ] = useState( false );
  const router = useRouter();
  const [ clientSecret, setClientSecret ] = useState( '' );
  const [ canShowErrors, setCanShowErrors ] = useState( false );

  const handlePayment = async () => {
    const locale = router.locale || 'en';

    const getCurrencyAndProductName = () => {
      switch ( locale ) {
        case 'pt':
          return { currency: 'BRL', productName: 'Verificar Erros - SudokuDan' };
        case 'es':
          return { currency: 'EUR', productName: 'Verificar Errores - SudokuDan' };
        default:
          return { currency: 'USD', productName: 'Check Errors - SudokuDan' };
      }
    };

    const { currency, productName } = getCurrencyAndProductName();

    // Solicita o clientSecret do backend
    const response = await fetch( '/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { currency, productName } ),
    } );
    const data = await response.json();
    setClientSecret( data.clientSecret );
    setShowModal2( true );
  };


  useEffect( () => {
    const getSavedGame = localStorage.getItem( 'sudoku' );
    const savedGame = getSavedGame ? getDecryptedFromLocalStorage( getSavedGame ) : null;

    if ( savedGame && savedGame.board && savedGame.puzzle && savedGame.solution ) {
      setHasSavedGame( true ); // Há um jogo salvo válido
    } else {
      setHasSavedGame( false ); // Não há jogo salvo válido
    }
  }, [] );

  useEffect( () => {

    if ( t ) {
      setTitle( t( 'title' ) );
      setDifficul( t( 'difficulty' ) );
      setEasy( t( 'easy' ) );
      setMedium( t( 'medium' ) );
      setHard( t( 'hard' ) );
      setStartGame1( t( 'startGame' ) );
      setCongratulations( t( 'congratulations' ) );
      setCompletedMessage( t( 'completedMessage' ) );
      setClose( t( 'close' ) );
      setStartNewGame( t( 'startNewGame' ) );
      setTitlePay( t( 'titlePay' ) );
      setPayMassage( t( 'payMassage' ) );
      setPay( t( 'pay' ) );
    }
  }, [ t ] );


  const startGame = () => {
    localStorage.removeItem( 'sudoku' ); // Remove o jogo salvo
    const { puzzle, solution } = generateSudoku( difficulty );
    setGame( { puzzle, solution } );
    setShowModal( false );
    setCurrentBoard( puzzle.map( row => [ ...row ] ) ); // Copia do puzzle inicial
    saveEncryptedToLocalStorage( 'sudoku', { puzzle, solution, board: puzzle.map( row => [ ...row ] ) } );
    setHasSavedGame( false ); // Invalida o jogo salvo
  };

  const handleComplete = () => {
    setShowModal( true );
  };

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center pt-10">
        <Image src="/logo.png" width={ 100 } height={ 100 } alt="Sudoku" />
        <h1 className="text-3xl font-bold mb-6 px-3 text-center mt-5">{ title }</h1>

        {
          hasSavedGame && showSavedGame && (
            <div className="mb-4 px-3">
              <h1 className="text-2xl font-bold mb-4 text-center p-3 rounded-md bg-gray-700 border border-white">{ t( 'savedGame' ) }</h1>

              <div className='flex items-center justify-center gap-5'>
                <button
                  onClick={ () => {
                    const { puzzle, solution, board } = savedGame;
                    setGame( { puzzle, solution } );
                    setCurrentBoard( board ); // Define o board salvo como atual
                    setShowModal( false );
                    setShowSavedGame( false );
                    setHasSavedGame( false ); // Invalida o jogo salvo
                  } }
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                >
                  { t( 'continue' ) }
                </button>

                <button
                  onClick={ () => {
                    localStorage.removeItem( 'sudoku' ); // Remove o jogo salvo
                    //clearUserInput( savedGame.puzzle ); // Limpa as células preenchidas pelo usuário
                    //startGame(); // Reinicia o jogo
                    //setShowSavedGame( false );
                    setHasSavedGame( false ); // Atualiza o estado local
                  } }
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                >
                  { t( 'restart' ) }
                </button>
              </div>
            </div>
          )
        }

        { !hasSavedGame &&
          <>
            { !savedGame &&
              <div className="mb-4 flex gap-4">
                <div className='px-3'>
                  <label htmlFor="difficulty" className="mr-2 font-semibold">
                    { difficul }:
                  </label>
                  <select
                    id="difficulty"
                    value={ difficulty }
                    onChange={ ( e ) => setDifficulty( e.target.value ) }
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-3 text-white rounded"
                  >
                    <option value="easy">{ easy }</option>
                    <option value="medium">{ medium }</option>
                    <option value="hard">{ hard }</option>
                  </select>
                </div>
                <button
                  onClick={ startGame }
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  { startGame1 }
                </button>
              </div>
            }
            { game && (
              <SudokuBoard
                puzzle={ game.puzzle }
                solution={ game.solution }
                onComplete={ handleComplete }
                savedGame={ savedGame }
                showModal2={ showModal2 }
                setShowModal2={ setShowModal2 }
                canShowErrors={ canShowErrors }
                handlePayment={ handlePayment }
              />
            ) }
            { game &&
              <button onClick={ () => { localStorage.removeItem( 'sudoku' ); setHasSavedGame( false ); setGame( null ); setCanShowErrors( false ); } } className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white mt-5">
                { t( 'newGame' ) }
              </button> }
          </> }

        <LanguageSwitcher />

        {/* Modal de Parabéns */ }
        { showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white text-black p-8 rounded-md">
              <h2 className="text-2xl font-bold mb-4">{ congratulations }</h2>
              <p className="mb-4">{ completedMessage }</p>
              <div className='flex items-center justify-center gap-5'>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={ () => setShowModal( false ) }
                >
                  { close }
                </button>

                {/* //botão de novo jogo */ }
                <button
                  onClick={ () => { localStorage.removeItem( 'sudoku' ); setHasSavedGame( false ); setGame( null ); setShowModal( false ); } }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  { startNewGame }
                </button>
              </div>
            </div>
          </div>
        ) }

        {/* Modal de pagamento */ }
        { showModal2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 px-3">
            <div className="bg-white text-black p-8 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-center">{ titlePay }</h2>
              <p className="mb-4">{ payMassage }</p>
              <Elements stripe={ stripePromise }>
                <PaymentForm
                  clientSecret={ clientSecret }
                  onClose={ () => setShowModal2( false ) }
                  onSuccess={ () => {
                    setShowModal2( false );
                    setCanShowErrors( true );
                  } }
                />
              </Elements>
            </div>
          </div>
        ) }
      </div >
    </>
  );
}

// Adicione suporte a tradução no SSR
export async function getStaticProps( { locale } ) {
  return {
    props: {
      ...( await serverSideTranslations( locale, [ 'common' ] ) ),
    },
  };
}