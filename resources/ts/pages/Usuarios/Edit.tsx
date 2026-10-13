import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/Field";
import { Usuario } from "../../types/usuario";

interface Props {
    usuario: Usuario;
}

export default function UsuariosEdit({ usuario }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        password: "",
        password_confirmation: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/usuarios/${usuario.id}`);
    }

    return (
        <AppLayout title="Editar Usuário">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Editar Usuário
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Atualize os dados de acesso
                    </p>
                </div>
                <Button render={<Link href="/usuarios" />} variant="outline">
                    Voltar
                </Button>
            </div>

            <Card className="mx-auto max-w-3xl">
                <form onSubmit={handleSubmit} id="edit-user-form">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Nome" required error={errors.name}>
                                <Input  
                                 autoComplete="off"
                                    type="text"
                                    placeholder="Nome completo"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    aria-invalid={!!errors.name}
                                />
                            </Field>

                            <Field label="E-mail" required error={errors.email}>
                                <Input
                                autoComplete="off"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    aria-invalid={!!errors.email}
                                />
                            </Field>

                            <Field
                                label="Nova Senha"
                                hint="Deixe em branco para manter a senha atual"
                                error={errors.password}
                            >
                                <Input
                                autoComplete="new-password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    aria-invalid={!!errors.password}
                                />
                            </Field>

                            <Field
                                label="Confirmar Nova Senha"
                                error={errors.password_confirmation}
                            >
                                <Input
                                    autoComplete="new-password"
                                    type="password"
                                    placeholder="Repita a nova senha"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                    aria-invalid={!!errors.password_confirmation}
                                />
                            </Field>

                            <Field label="Perfil" required error={errors.role}>
                                <Select
                                    value={data.role || null}
                                    onValueChange={(value) =>
                                        setData("role", value ?? "user")
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">Colaborador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-end gap-2">
                        <Button render={<Link href="/usuarios" />} variant="outline">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Salvando..." : "Salvar"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AppLayout>
    );
}
