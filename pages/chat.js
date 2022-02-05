import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDAxNjMzNiwiZXhwIjoxOTU5NTkyMzM2fQ.gjz-NmKy4lLnaT2xQe1cWCqDuyWHQU76VzGVypwLcJo'
const SUPABASE_URL = 'https://evbtlvtdvhqasgkppfue.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('')
    const [mensagemList, setMensagemList] = React.useState([]);

    React.useEffect(()=>{
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', {ascending:false})
        .then(({data}) => {
            console.log(data)
            setMensagemList(data);
        });
    }, [])

    function handleNovaMensagem(novaMensagem) {

        novaMensagem = {
            texto: novaMensagem,
            usuario: 'Diogo'
        }

        supabaseClient
        .from('mensagens')
        .insert([novaMensagem])
        .then(({data})=>{
            setMensagemList([
                data[0],
                ...mensagemList
            ]);
        })

    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url("/img/${appConfig.theme.backgrounds.fundoPrincipal}")`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.reactColor[300]
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={mensagemList} />

                    {/* <ul>
                        {mensagemList.map((mensagemAtual) => {
                            return (
                                <li id={mensagemAtual.id} key={mensagemAtual.id}>{mensagemAtual.texto}</li>
                            )
                        })}
                    </ul> */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(e)=> {
                                const mensagemText = e.target.value;
                                setMensagem(mensagemText);
                            }}

                            onKeyPress={(e)=> {
                                if(e.key === 'Enter') {
                                    e.preventDefault;
                                    handleNovaMensagem(mensagem);
                                    setMensagem('');
                                }
                            }}

                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const mensagens = props.mensagens;
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {mensagens.map((mensagem) =>
            <Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >
                <Box
                    styleSheet={{
                        marginBottom: '8px',
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/diogzz.png`}
                    />
                    <Text tag="strong">
                        {mensagem.usuario}
                    </Text>
                    <Text
                        styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                {mensagem.texto}
            </Text>
            )}
        </Box>
    )
}