import React, { useEffect } from 'react';
import BackendURL from '../BackendURL';
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Alert, AlertIcon, Box, Flex, Heading, Spinner, Stack, Table, Tbody, Td, Thead, Tr, FormControl, FormLabel, Input, Button, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';

const Admin = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, SetError] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setID] = useState("");
    const [page, setPage] = useState(1);
    const [state, setState] = useState({
        name: "",
        email: "",
        address: ""
    });

    useEffect(() => {
        getUser(page);
    }, [page]);

    // Global Filter
    const handleFilter = (e) => {
        const { value } = e.target;
        getUser(page, value, "");
    };
    const handleFilter1 = (e) => {
        const { value } = e.target;
        getUser(page, "", value);
    };

    // For get All USers
    const getUser = async (page, qu = "", qa = "") => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false)
        }, 5000);
        let res = await fetch(`${BackendURL}/user/?page=${page}&limit=5&name=${qu}&address=${qa}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email": localStorage.getItem("email")
            }
        }).then((res) => res.json()).then((res) => {
            setLoading(false);
            SetError(false);
            if (res.status === "NO") {
                alert("You are not Admin");
                navigate("/");
            }
            if (res.message === "OK") {
                setUsers(res.user)
            }
        }).catch((err) => {
            setLoading(false);
            SetError(true);
            console.log(err)
        });
    };

    // Pagination Function
    const handlePage = (val) => {
        let value = val + page;
        setPage(value);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setState({ ...state, [name]: value });
    };

    // For Update User Datails by Admin Only;
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await fetch(`${BackendURL}/user/update/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "email": localStorage.getItem("email")
            },
            body: JSON.stringify(state)
        }).then((res) => res.json()).then((res) => {
            alert(`${res.msg}`);
            getUser(page);
        }).catch((err) => {
            console.log(err)
        });
        setState({ name: "", email: "", address: "" });
    };
    const handleUpdate = (id) => {
        setID(id);
        onOpen();
    };

    // For Delete user Details By Admin Only;
    const handleRemove = async (_id) => {
        let res = await fetch(`${BackendURL}/user/delete/${_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "email": localStorage.getItem("email")
            },
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            getUser(page);
            alert(`${res.msg}`)
        }).catch((err) => {
            console.log(err)
        });
    };

    const { name, email, address } = state;
    return (
        <>
            <Heading textAlign={"center"} m={"2% 0"}>Admin Panel</Heading>

            {/* Loading and Error Handling */}
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}> {loading && <Spinner color='red' />} </Box>
            {error && <Alert status='error'>
                <AlertIcon />
                Somthing went wrong!
            </Alert>}
            <hr />
            <Heading textAlign={"left"} m={"2% 0"}>Users Details</Heading>
            <Box m={"1% 0"} display={"flex"} justifyContent="center" alignItems={"center"} gap="10px">
                <Input w={{ base: "15%", sm: "31%", lg: "15%" }} placeholder='Search Username' onChange={handleFilter}></Input>
                <Input w={{ base: "15%", sm: "30%", lg: "15%" }} placeholder='Search Address' onChange={handleFilter1}></Input>
            </Box>

            {/* Display Users in Tabular Formate */}
            <Box>
                <Table variant={"striped"}>
                    <Thead fontSize={"23px"} color="blue">
                        <Tr>
                            <Td>Name</Td>
                            <Td>Email</Td>
                            <Td>Address</Td>
                            <Td>Login At</Td>
                            <Td>Update</Td>
                            <Td>Remove</Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users && users.map((ele) =>
                            <Tr key={ele._id}>
                                <Td>{ele.name}</Td>
                                <Td>{ele.email}</Td>
                                <Td>{ele.address}</Td>
                                <Td>{ele.createdAt}</Td>
                                <Td><Button variant={"outline"} color={"green"} onClick={() => handleUpdate(ele._id)}> <AiOutlineEdit /></Button></Td>
                                <Td><Button variant={"outline"} color={"red"} onClick={() => handleRemove(ele._id)}> <AiFillDelete /> </Button></Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal for Update User Details */}
            <Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>User Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box>
                                <Flex minH={"0vh"} align={"center"} justify={"center"} bg="#F1F6F5">
                                    <Stack spacing={8} mx={"auto"} maxW={{ base: "lg", sm: "sm", lg: "lg", xl: "lg", "2xl": "lg" }} py={12} px={6}>
                                        <Box
                                            rounded={"lg"}
                                            bg={useColorModeValue("white", "gray.700")}
                                            boxShadow={"lg"}
                                            p={8}
                                        >
                                            <Stack spacing={4}>
                                                <FormControl id="firstName" isRequired>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input
                                                        name='name'
                                                        value={name}
                                                        type="text"
                                                        placeholder="Name"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>

                                                <FormControl id="address">
                                                    <FormLabel>Address</FormLabel>
                                                    <Input
                                                        value={address}
                                                        name="address"
                                                        required
                                                        placeholder="Address"
                                                        type="text"
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                                <FormControl id="email" isRequired>
                                                    <FormLabel>Email address</FormLabel>
                                                    <Input
                                                        value={email}
                                                        placeholder="Email"
                                                        type="email"
                                                        name='email'
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormControl>
                                                <Stack spacing={10} pt={2}>
                                                    <Button
                                                        fontWeight="600"
                                                        bgColor="black"
                                                        size="lg"
                                                        color="white"
                                                        borderRadius="0"
                                                        _hover={{
                                                            bg: "cyan.500"
                                                        }}
                                                        onClick={handleSubmit}
                                                    >
                                                        Update User
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Flex>
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>

            {/* Pagination Cart */}
            <Box display={"flex"} alignItems="center" justifyContent={"center"} m="1% 0" gap={"5px"}>
                <Button variant={"outline"} color="green" isDisabled={page <= 1} onClick={() => handlePage(-1)}>PRE</Button>
                <Button variant={"outline"} color="red" isDisabled={true}>{page}</Button>
                <Button variant={"outline"} color="green" isDisabled={page >= 5} onClick={() => handlePage(1)}>NEXT</Button>
            </Box>
        </>
    );
}

export default Admin;